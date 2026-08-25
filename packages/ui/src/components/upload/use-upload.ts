"use client";

import { useState } from "react";

/**
 * Pending/error bookkeeping around one upload call — the other half of `<Dropzone>`, which
 * only emits `File[]`. Deliberately not TanStack Query's `useMutation`: an upload here has no
 * server-state cache entry to invalidate (the result is read back as an image URL, not a
 * query), and `@dv/ui` has no query-client dependency. Callers that DO have a cache to
 * invalidate (Studio's asset list) should keep using `useMutation` instead.
 */
export function useUpload<TArg = File, TResult = void>(
  uploadFn: (arg: TArg) => Promise<TResult>,
  onSuccess?: (result: TResult) => void
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function upload(arg: TArg) {
    setIsPending(true);
    setError(null);
    try {
      onSuccess?.(await uploadFn(arg));
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error(String(cause)));
    } finally {
      setIsPending(false);
    }
  }

  return { upload, isPending, error };
}
