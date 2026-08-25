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
