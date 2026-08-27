import { storage } from "@dv/drivers";

import type { Bindings } from "../types.js";
import { ApiError } from "./errors.js";

/**
 * CF Workers gets the R2 driver via its bucket binding. Bun/VPS gets a
 * filesystem-backed driver (local-dev standing for the real S3 driver,
 * Phase 7, architecture.md §3) — see `local-fs.ts` for why. Both are cheap
 * to construct per request (no persistent connection), unlike `lib/db.ts`.
 */
export function createStorageFromEnv(env: Bindings): storage.StorageDriver {
  if (env.RUNTIME === "workers") {
    if (!env.LANDING_ASSETS_BUCKET) {
      throw new ApiError(
        501,
        "storage_unavailable",
        "LANDING_ASSETS_BUCKET binding is missing"
      );
    }
    return storage.createR2StorageDriver(env.LANDING_ASSETS_BUCKET);
  }
  return storage.createLocalFsStorageDriver(
    env.LOCAL_STORAGE_DIR || ".data/storage"
  );
}
