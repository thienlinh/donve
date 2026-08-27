import type { InspectorValues } from "@dv/studio-ui";
import { z } from "zod";

/** Per-element visual/CSS props edited by the Settings tab's `InspectorPanel` (`@dv/studio-ui`)
 * — same key set as `InspectorValues` (the single source of truth for which fields the panel
 * renders, so the two can't drift), but values are the CSS-ready form `InspectorPanel.onCommit`
 * actually emits (e.g. `"16px"`, not the bare `16` its `values` prop expects back for display —
 * `NumberValue` appends a unit on commit, see its own doc comment in `inspector-panel.tsx`).
 * `settings-tab.tsx` converts between the two directions; `apply-element-style.tsx` applies this
 * shape straight onto a rendered element's `style`. Stored as an optional `style` key riding
 * along in an element's props bag (not merged into any component's own props schema —
 * `PageSpecElement.props` is a loose `z.record`, see `packages/contracts/src/studio.ts`), so no
 * per-component schema changes and no exposure to the AI content agent's JSON Schema. */
export type StyleProps = Partial<
  Record<keyof InspectorValues, string | number>
>;

export const imagePropsSchema = z.object({
  src: z.string(),
  alt: z.string()
});
export type ImageProps = z.infer<typeof imagePropsSchema>;

/** An uploaded video asset + its client-extracted first frame (FR-B-29). Distinct from a
 * plain `videoUrl` string prop, which is a third-party embed URL the user pastes. */
export const videoPropsSchema = z.object({
  src: z.string(),
  poster: z.string().optional()
});
export type VideoProps = z.infer<typeof videoPropsSchema>;
