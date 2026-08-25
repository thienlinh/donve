import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const richTextBlockVariantValues = ["article_style"] as const;

/** Structured blocks, not raw HTML — AI never writes markup directly (`agent-pipeline.md`). */
const richTextNodeSchema = z.object({
  type: z.enum(["heading", "paragraph", "list_item"]),
  text: z.string()
});

export const richTextBlockPropsSchema = z.object({
  nodes: z.array(richTextNodeSchema).min(1),
  variant: z.enum(richTextBlockVariantValues)
});
export type RichTextBlockProps = z.infer<typeof richTextBlockPropsSchema>;

export function RichTextBlockRender({
  props
}: BaseComponentProps<RichTextBlockProps>) {
  return (
    <section
      data-lp-component="rich_text_block"
      data-lp-variant={props.variant}
      className="prose mx-auto max-w-2xl px-6 py-12 text-[var(--lp-color-foreground)] md:px-12"
    >
      {props.nodes.map((node, index) => {
        if (node.type === "heading") {
          return (
            <h3 key={index} className="text-xl font-bold">
              {node.text}
            </h3>
          );
        }
        if (node.type === "list_item") {
          return <li key={index}>{node.text}</li>;
        }
        return <p key={index}>{node.text}</p>;
      })}
    </section>
  );
}

export const richTextBlockMeta: ComponentMeta = {
  componentId: "rich_text_block",
  category: "Content",
  variants: richTextBlockVariantValues,
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
