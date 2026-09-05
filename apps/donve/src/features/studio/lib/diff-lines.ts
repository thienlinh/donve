export type DiffLine = {
  key: string;
  type: "same" | "add" | "remove";
  text: string;
};

/**
 * Minimal LCS line diff for the version-history compare view — studio-builder-spec.md's
 * "text diff HTML" requirement, without pulling in a diff dependency (none is in the
 * `ui` catalog; this is ~30 lines, not worth adding one for).
 */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const n = a.length;
  const m = b.length;

  // lcs[i][j] = length of the longest common subsequence of a[i:] and b[j:]
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from<number>({ length: m + 1 }).fill(0)
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i]![j] =
        a[i] === b[j]
          ? lcs[i + 1]![j + 1]! + 1
          : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ key: `s${i}-${j}`, type: "same", text: a[i]! });
      i++;
      j++;
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      result.push({ key: `r${i}`, type: "remove", text: a[i]! });
      i++;
    } else {
      result.push({ key: `a${j}`, type: "add", text: b[j]! });
      j++;
    }
  }
  while (i < n) {
    result.push({ key: `r${i}`, type: "remove", text: a[i]! });
    i++;
  }
  while (j < m) {
    result.push({ key: `a${j}`, type: "add", text: b[j]! });
    j++;
  }
  return result;
}
