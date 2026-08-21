import { ApiError } from "./errors.js";

// architecture.md §7: "SSRF qua import URL | Chỉ fetch qua proxy có allowlist scheme/deny
// private IP." Any URL a tenant pastes (FR-B-30's "paste link artifact công khai") or that
// shows up inside imported HTML (an <img src>) is attacker-controlled input to a server-side
// fetch — without this check a tenant could point it at an internal service or the cloud
// metadata endpoint and have our own server make the request on their behalf.
const ALLOWED_SCHEMES = new Set(["http:", "https:"]);

const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);

/** IPv4 octet ranges that are never a legitimate "public artifact" target: loopback,
 * link-local (incl. the 169.254.169.254 cloud metadata address), and the three RFC1918
 * private ranges. */
function isPrivateIpv4(hostname: string): boolean {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname);
  if (!match) return false;
  const [a, b] = [Number(match[1]), Number(match[2])];
  if (a === 127 || a === 10 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateIpv6(hostname: string): boolean {
  const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return (
    h === "::1" ||
    h.startsWith("fc") ||
    h.startsWith("fd") ||
    h.startsWith("fe80")
  );
}

/**
 * Throws unless `url` is a plausible public HTTP(S) resource. This is a hostname/literal-IP
 * allowlist, not a DNS-resolution-based check — Workers has no pre-fetch DNS API to resolve a
 * domain before dialing it, so a domain that *resolves* to a private address at request time
 * (DNS rebinding) isn't caught here.
 * ponytail: literal-IP + hostname denylist only, add a resolve-then-check step (or route
 * through an actual egress proxy) if DNS rebinding becomes a real threat for this feature.
 */
export function assertSafeImportUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new ApiError(400, "invalid_import_url");
  }
  if (!ALLOWED_SCHEMES.has(parsed.protocol)) {
    throw new ApiError(400, "invalid_import_url_scheme");
  }
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".local")) {
    throw new ApiError(400, "import_url_not_allowed");
  }
  if (isPrivateIpv4(hostname) || isPrivateIpv6(hostname)) {
    throw new ApiError(400, "import_url_not_allowed");
  }
  return parsed;
}

export const MAX_IMPORT_FETCH_BYTES = 20 * 1024 * 1024;

/** SSRF-checked `fetch` — used for both the top-level "paste link" import and any external
 * `<img src>` an imported document points at. Doesn't itself cap the response size (a
 * `Content-Length` header can't be trusted: chunked responses omit it and a hostile origin can
 * just lie) — callers must read the body through `readCappedBytes` instead of
 * `res.arrayBuffer()`/`res.text()` directly. */
export async function safeFetch(url: string): Promise<Response> {
  assertSafeImportUrl(url);
  return fetch(url, { redirect: "error" });
}

/**
 * Reads `res.body` up to `maxBytes`, aborting the stream instead of buffering past the cap —
 * the size guard a raw `res.arrayBuffer()`/`res.text()` call doesn't give you, since a response
 * can omit or misreport `Content-Length` (chunked transfer, or a hostile origin lying about it).
 */
export async function readCappedBytes(
  res: Response,
  maxBytes: number = MAX_IMPORT_FETCH_BYTES
): Promise<Uint8Array> {
  if (!res.body) return new Uint8Array(await res.arrayBuffer());

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    // oxlint-disable-next-line no-await-in-loop -- must read sequentially to abort mid-stream once the running total crosses maxBytes
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      // oxlint-disable-next-line no-await-in-loop -- see above
      await reader.cancel();
      throw new ApiError(413, "import_fetch_too_large");
    }
    chunks.push(value);
  }

  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}
