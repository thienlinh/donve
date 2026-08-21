const POSTER_QUALITY = 0.82;

/**
 * FR-B-29: extract the first frame of an uploaded video as a JPEG blob, for use as a
 * poster/thumbnail — same canvas `drawImage` technique `image-compress.ts` uses for images,
 * just sourced from a `<video>` element (seeked to time 0) instead of an `ImageBitmap`.
 */
export async function extractVideoPoster(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.playsInline = true;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("video_load_failed"));
    });
    // Some browsers deliver `loadeddata` for frame 0 already; seeking to 0 explicitly is what
    // makes the following `seeked` event fire reliably across engines that don't.
    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("video_seek_failed"));
      video.currentTime = 0;
    });

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas_2d_unavailable");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", POSTER_QUALITY)
    );
    if (!blob) throw new Error("poster_encode_failed");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
