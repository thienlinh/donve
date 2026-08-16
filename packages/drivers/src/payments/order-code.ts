// Crockford32 — same alphabet family as `ulid` (already used repo-wide), excludes O/I/L/U so it
// reads unambiguously in a bank transfer note. database-schema.md note #3: 6 data chars + 1
// checksum char, "mod-31 or equivalent" — the exact scheme is this project's own, not a public
// standard, since order codes never leave this system.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const DATA_LENGTH = 6;

// Typo-correction table for FR-D-05 step 2 — characters visually confusable when handwritten
// or misread from a bank app, mapped to the alphabet's canonical form.
const CONFUSABLES: Record<string, string> = {
  O: "0",
  I: "1",
  L: "1",
  S: "5",
  B: "8",
};

function charValue(char: string): number {
  return ALPHABET.indexOf(char);
}

function computeChecksum(data: string): string {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    // positional weight so a transposition (swapped chars) also changes the checksum
    sum += charValue(data.charAt(i)) * (i + 1);
  }
  return ALPHABET.charAt(sum % 31);
}

export function encodeOrderCode(data: string): string {
  if (data.length !== DATA_LENGTH) {
    throw new RangeError(
      `order code data must be exactly ${DATA_LENGTH} chars`
    );
  }
  for (const char of data) {
    if (charValue(char) === -1) {
      throw new RangeError(`invalid order code character: ${char}`);
    }
  }
  return data + computeChecksum(data);
}

export function isValidOrderCode(code: string): boolean {
  if (code.length !== DATA_LENGTH + 1) return false;
  const data = code.slice(0, DATA_LENGTH);
  const checksum = code[DATA_LENGTH];
  if (data.split("").some((char) => charValue(char) === -1)) return false;
  return computeChecksum(data) === checksum;
}

function normalizeConfusables(code: string): string {
  return code
    .split("")
    .map((char) => CONFUSABLES[char] ?? char)
    .join("");
}

export interface ExtractedOrderCodes {
  /** Checksum-valid as typed, no correction applied. */
  exact: string[];
  /** Only valid after normalizing confusable characters — still a checksum-valid code, not a low-confidence guess. */
  corrected: string[];
}

/**
 * FR-D-05 step 1/2: scan free-text transfer content for `prefix + 6 data chars + checksum`
 * windows. Tries exact matches first; corrected matches only exist where the *original* window
 * failed checksum but passes after substituting confusable chars. Caller still applies the
 * order-status/amount/expiry rules (see content-based-matching.ts) — this only proves the code
 * is well-formed, not that it belongs to an eligible order.
 */
export function extractOrderCodes(
  content: string,
  prefix: string
): ExtractedOrderCodes {
  const windowSize = prefix.length + DATA_LENGTH + 1;
  const upper = content.toUpperCase();
  const exact = new Set<string>();
  const corrected = new Set<string>();

  for (let i = 0; i <= upper.length - windowSize; i++) {
    const window = upper.slice(i, i + windowSize);
    if (!window.startsWith(prefix)) continue;
    const code = window.slice(prefix.length);

    if (isValidOrderCode(code)) {
      exact.add(code);
      continue;
    }
    const normalized = normalizeConfusables(code);
    if (normalized !== code && isValidOrderCode(normalized)) {
      corrected.add(normalized);
    }
  }

  return { exact: [...exact], corrected: [...corrected] };
}
