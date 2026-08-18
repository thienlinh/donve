// Patch ops are owned by studio-core (srcmap engine) — re-exported here so
// callers only need @dv/studio-ai for the AI-facing surface (prompt + tool).
export type { PatchOp, PatchOpType } from "@dv/studio-core";
