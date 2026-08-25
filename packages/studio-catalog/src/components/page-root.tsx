import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

/**
 * Engine bookkeeping only — not one of the ~25 taxonomy components. `PageSpec.root` must
 * point at an element with a real catalog `type`; this is that type, holding the page's
 * top-level section order via the flat element's `children` array.
 */
export const pageRootPropsSchema = z.object({});
export type PageRootProps = z.infer<typeof pageRootPropsSchema>;

export function PageRootRender({
  children
}: BaseComponentProps<PageRootProps>) {
  return <div data-lp-component="page_root">{children}</div>;
}
