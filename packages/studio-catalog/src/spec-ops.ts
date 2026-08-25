import type { Spec } from "@json-render/core";
import { z } from "zod";

import { catalogComponents } from "./catalog.js";

/**
 * PageSpec-addressed patch vocabulary for the native Studio's in-canvas AI chat
 * (`ai/agent-pipeline.md` §In-canvas chat). Deliberately NOT `@dv/studio-ai`'s `PatchOp`, which
 * is HTML/srcmap-addressed and meaningless against a `PageSpec` (no HTML, no free-form styles —
 * only per-component Zod-typed props). Same protocol *shape* as the legacy one (a single tool,
 * an array of ops, server-side validation, in-turn retry), different vocabulary.
 *
 * No path-addressed `setElementProp` (validation always re-parses the whole props object
 * anyway), no `apply_full_page` fallback, no `setVisible` — all three explicitly out of scope.
 */
export const specPatchOpSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("setProps"),
    elementId: z.string(),
    /** Shallow-merged over the element's current props, then re-parsed as a whole. */
    props: z.record(z.string(), z.unknown())
  }),
  z.object({
    op: z.literal("insertElement"),
    componentId: z.string(),
    props: z.record(z.string(), z.unknown()),
    /** `null` = insert at the top of the page. The server assigns the element id. */
    afterElementId: z.string().nullable()
  }),
  z.object({
    op: z.literal("removeElement"),
    elementId: z.string()
  }),
  z.object({
    op: z.literal("moveElement"),
    elementId: z.string(),
    afterElementId: z.string().nullable()
  })
]);
export type SpecPatchOp = z.infer<typeof specPatchOpSchema>;

export interface ApplySpecOpsResult {
  /** The patched spec, or the untouched input one when `errors` is non-empty (all-or-nothing). */
  spec: Spec;
  errors: string[];
}

type MutableElements = Record<
  string,
  { type: string; props: Record<string, unknown>; children?: string[] }
>;

/**
 * Applies `ops` in order against a deep copy of `spec`. Every op is validated against the real
 * catalog — the element/component must exist, and the resulting props must parse against that
 * component's own Zod schema. Any failure aborts the whole batch (the caller reports the issues
 * back to the model, which retries in the same turn), so a half-applied page can never be
 * persisted.
 */
export function applySpecOps(
  spec: Spec,
  ops: SpecPatchOp[]
): ApplySpecOpsResult {
  const next = structuredClone(spec);
  const elements = next.elements as MutableElements;
  const root = elements[next.root];
  if (!root) return { spec, errors: ["page root element is missing"] };
  const children = (root.children ??= []);

  const errors: string[] = [];
  for (const [index, op] of ops.entries()) {
    const error = applyOne(elements, children, op);
    if (error) errors.push(`ops[${index}] (${op.op}): ${error}`);
  }

  return errors.length > 0 ? { spec, errors } : { spec: next, errors };
}

function applyOne(
  elements: MutableElements,
  children: string[],
  op: SpecPatchOp
): string | null {
  switch (op.op) {
    case "setProps": {
      const element = elements[op.elementId];
      if (!element) return `unknown elementId "${op.elementId}"`;
      const parsed = parseProps(element.type, {
        ...element.props,
        ...op.props
      });
      if ("error" in parsed) return parsed.error;
      element.props = parsed.props;
      return null;
    }
    case "insertElement": {
      const parsed = parseProps(op.componentId, op.props);
      if ("error" in parsed) return parsed.error;
      const at = insertIndex(children, op.afterElementId);
      if (at === null) return `unknown afterElementId "${op.afterElementId}"`;
      const elementId = `${op.componentId}-${crypto.randomUUID().slice(0, 8)}`;
      elements[elementId] = {
        type: op.componentId,
        props: parsed.props,
        children: []
      };
      children.splice(at, 0, elementId);
      return null;
    }
    case "removeElement": {
      const at = children.indexOf(op.elementId);
      if (at === -1) return `unknown elementId "${op.elementId}"`;
      children.splice(at, 1);
      delete elements[op.elementId];
      return null;
    }
    case "moveElement": {
      const from = children.indexOf(op.elementId);
      if (from === -1) return `unknown elementId "${op.elementId}"`;
      if (op.afterElementId === op.elementId) {
        return "afterElementId cannot be the moved element itself";
      }
      children.splice(from, 1);
      const at = insertIndex(children, op.afterElementId);
      if (at === null) {
        children.splice(from, 0, op.elementId);
        return `unknown afterElementId "${op.afterElementId}"`;
      }
      children.splice(at, 0, op.elementId);
      return null;
    }
  }
}

function parseProps(
  componentId: string,
  props: Record<string, unknown>
): { props: Record<string, unknown> } | { error: string } {
  const entry = catalogComponents[componentId];
  if (!entry) return { error: `unknown componentId "${componentId}"` };
  const parsed = entry.props.safeParse(props);
  if (!parsed.success) {
    return {
      error: `props do not match ${componentId}'s schema: ${parsed.error?.message ?? "schema mismatch"}`
    };
  }
  return { props: parsed.data as Record<string, unknown> };
}

/** `null` afterElementId = top of the page; `null` return = the id isn't on the page. */
function insertIndex(
  children: string[],
  afterElementId: string | null
): number | null {
  if (afterElementId === null) return 0;
  const at = children.indexOf(afterElementId);
  return at === -1 ? null : at + 1;
}
