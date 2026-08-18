const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;

/**
 * FR-B-29: compress + convert an uploaded image to WebP before it reaches the API.
 * ponytail: AVIF has no reliable `canvas.toBlob` encoder support across browsers yet —
 * WebP only for v1; add an AVIF path (or server-side transcode) if a browser gap shows up.
 */
export async function compressToWebp(
  file: File
): Promise<{ blob: Blob; fileName: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_2d_unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
  );
  if (!blob) throw new Error("webp_encode_failed");

  const baseName = file.name.replace(/\.[^./\\]+$/, "");
  return { blob, fileName: `${baseName}.webp` };
}
