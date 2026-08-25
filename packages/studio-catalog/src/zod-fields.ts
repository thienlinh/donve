/**
 * Structural helpers over a Zod v4 schema, typed as `unknown` on purpose — `@json-render/core`
 * resolves its own nested `zod` install (bun's isolated linker doesn't dedupe it against this
 * app's), so its schema objects are a different nominal `ZodType` than the one this app's own
 * `zod` import produces, even at the same version. Real Zod objects at runtime either way; only
 * the TS nominal identity differs, so these helpers deliberately don't import `z` at all.
 */

// oxlint-disable no-explicit-any -- see file header; can't reference the real ZodType here
type AnySchema = any;

export interface UnwrappedField {
  schema: AnySchema;
  kind: string;
  required: boolean;
}

/** Zod v4 wraps every modifier (`.optional()`, `.default()`, `.nullable()`) as its own node —
 * unwrap down to the real field type before switching on `.def.type` in the Inspector form. */
export function unwrapField(schema: AnySchema): UnwrappedField {
  let current = schema;
  let required = true;
  while (
    current?.def?.type === "optional" ||
    current?.def?.type === "default" ||
    current?.def?.type === "nullable"
  ) {
    if (current.def.type !== "default") required = false;
    current = current.def.innerType;
  }
  return { schema: current, kind: current?.def?.type ?? "unknown", required };
}

export function enumOptions(schema: AnySchema): string[] {
  return schema?.options ?? [];
}

export function objectShape(
  schema: AnySchema
): Record<string, AnySchema> | null {
  const unwrapped = unwrapField(schema);
  if (unwrapped.kind !== "object") return null;
  return unwrapped.schema.shape;
}

export function arrayElementSchema(schema: AnySchema): AnySchema {
  const unwrapped = unwrapField(schema);
  if (unwrapped.kind !== "array") return null;
  return unwrapped.schema.def.element;
}
