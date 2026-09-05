import type { PageSpec, PageSpecElement } from "@dv/contracts";

import { diffLines, type DiffLine } from "../../studio/lib/diff-lines";

/** One changed prop's old/new value, plus the line-level diff of their pretty-printed JSON
 * (`diffLines` — same LCS algorithm the legacy editor's HTML diff uses, reused here for
 * display, not a new algorithm). */
export type PropDiff = {
  key: string;
  before: string;
  after: string;
  lines: DiffLine[];
};

export type ElementDiff =
  | { id: string; status: "added"; after: PageSpecElement }
  | { id: string; status: "removed"; before: PageSpecElement }
  | {
      id: string;
      status: "changed";
      before: PageSpecElement;
      after: PageSpecElement;
      props: PropDiff[];
    };

/**
 * Structural diff of two PageSpec `elements` maps (studio-native has no HTML to line-diff the
 * way the legacy editor does — this compares the JSON structure directly). Shallow: an element
 * is "changed" if its whole object stringifies differently at all; unchanged elements are
 * omitted. `changed` elements additionally get a per-prop diff for display.
 */
export function diffPageSpecElements(
  before: PageSpec["elements"],
  after: PageSpec["elements"]
): ElementDiff[] {
  const ids = [
    ...new Set([...Object.keys(before), ...Object.keys(after)])
  ].toSorted();

  const result: ElementDiff[] = [];
  for (const id of ids) {
    const beforeEl = before[id];
    const afterEl = after[id];
    if (beforeEl && !afterEl) {
      result.push({ id, status: "removed", before: beforeEl });
    } else if (!beforeEl && afterEl) {
      result.push({ id, status: "added", after: afterEl });
    } else if (
      beforeEl &&
      afterEl &&
      JSON.stringify(beforeEl) !== JSON.stringify(afterEl)
    ) {
      result.push({
        id,
        status: "changed",
        before: beforeEl,
        after: afterEl,
        props: diffProps(beforeEl.props, afterEl.props)
      });
    }
  }
  return result;
}

function diffProps(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): PropDiff[] {
  const keys = [
    ...new Set([...Object.keys(before), ...Object.keys(after)])
  ].toSorted();

  const result: PropDiff[] = [];
  for (const key of keys) {
    const beforeStr = JSON.stringify(before[key], null, 2) ?? "undefined";
    const afterStr = JSON.stringify(after[key], null, 2) ?? "undefined";
    if (beforeStr === afterStr) continue;
    result.push({
      key,
      before: beforeStr,
      after: afterStr,
      lines: diffLines(beforeStr, afterStr)
    });
  }
  return result;
}
