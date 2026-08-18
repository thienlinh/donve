import { applyOp } from "./ops.js";
import type { Srcmap } from "./srcmap.js";
import type { PatchOp } from "./types.js";

const DEFAULT_MAX_ENTRIES = 100;

type HistoryEntry = { op: PatchOp; undo: () => void };

/** Op-sized undo/redo stack (FR-B-15) — each entry is one op, never a full-file snapshot. */
export class PatchHistory {
  #srcmap: Srcmap;
  #maxEntries: number;
  #undoStack: HistoryEntry[] = [];
  #redoStack: PatchOp[] = [];

  constructor(srcmap: Srcmap, maxEntries = DEFAULT_MAX_ENTRIES) {
    this.#srcmap = srcmap;
    this.#maxEntries = maxEntries;
  }

  /** Applies `op` and records it. No-ops (stale/removed target) are not recorded. */
  commit(op: PatchOp): void {
    const undo = applyOp(this.#srcmap, op);
    if (!undo) return;
    this.#undoStack.push({ op, undo });
    if (this.#undoStack.length > this.#maxEntries) this.#undoStack.shift();
    this.#redoStack = [];
  }

  undo(): boolean {
    const entry = this.#undoStack.pop();
    if (!entry) return false;
    entry.undo();
    this.#redoStack.push(entry.op);
    if (this.#redoStack.length > this.#maxEntries) this.#redoStack.shift();
    return true;
  }

  redo(): boolean {
    const op = this.#redoStack.pop();
    if (!op) return false;
    const undo = applyOp(this.#srcmap, op);
    if (undo) this.#undoStack.push({ op, undo });
    return true;
  }

  canUndo(): boolean {
    return this.#undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.#redoStack.length > 0;
  }
}
