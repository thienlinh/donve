/**
 * Upload limits shared by every multipart image/video endpoint (landing-page assets,
 * entity images). Images arrive already compressed/converted client-side (`compressToWebp`),
 * video never is — hence the two different caps (FR-B-29).
 */
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif"
]);
export const ALLOWED_VIDEO_MIME = new Set(["video/mp4", "video/webm"]);

/**
 * Strips path separators and control chars from a client-supplied file name before it's ever
 * used as (part of) a storage key — `file.name` is fully attacker-controlled, and a raw `..` or
 * `/` segment can walk a storage key outside its intended prefix (real finding: the local-fs
 * driver only rejects `..` at the start of a *resolved* key, not one smuggled in via a segment).
 */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "";
  const cleaned = Array.from(base)
    .filter((char) => char.codePointAt(0)! > 0x1f && char !== "\x7f")
    .join("")
    .replace(/^\.+/, "");
  return cleaned.slice(-200) || "file";
}
