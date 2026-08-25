/**
 * `ai/agent-pipeline.md` §Guardrails: "Field sensitive trong Zod schema (giá, guarantee, legal
 * claim) — patch bị từ chối nếu thiếu humanApproved, enforce ở tầng type." Auto Fixer never has
 * a human in the loop, so it can never satisfy `humanApproved` — the guardrail is enforced here
 * by simply restoring the pre-fix value at every sensitive path after Content Agent regenerates
 * an element's props, regardless of what the model returned.
 *
 * Paths use dot notation with an `[]` array-wildcard segment (`componentMetadata`'s
 * `sensitiveProps`, e.g. `"plans[].price"`, `"items[].claim"`).
 */
export function restoreSensitiveProps(
  newProps: Record<string, unknown>,
  oldProps: Record<string, unknown>,
  sensitivePaths: readonly string[]
): Record<string, unknown> {
  const result = structuredClone(newProps);
  for (const path of sensitivePaths) {
    restorePath(result, oldProps, path.split("."));
  }
  return result;
}

function restorePath(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  segments: string[]
): void {
  const [head, ...rest] = segments;
  if (head === undefined) return;

  const arrayMatch = /^(\w+)\[\]$/.exec(head);
  if (arrayMatch) {
    const key = arrayMatch[1] as string;
    const targetArray = target[key];
    const sourceArray = source[key];
    if (!Array.isArray(targetArray) || !Array.isArray(sourceArray)) return;
    const len = Math.min(targetArray.length, sourceArray.length);
    for (let i = 0; i < len; i++) {
      if (rest.length === 0) {
        targetArray[i] = sourceArray[i];
      } else {
        restorePath(targetArray[i], sourceArray[i], rest);
      }
    }
    return;
  }

  if (rest.length === 0) {
    if (head in source) target[head] = source[head];
    return;
  }
  const nextTarget = target[head];
  const nextSource = source[head];
  if (
    nextTarget &&
    typeof nextTarget === "object" &&
    nextSource &&
    typeof nextSource === "object"
  ) {
    restorePath(
      nextTarget as Record<string, unknown>,
      nextSource as Record<string, unknown>,
      rest
    );
  }
}
