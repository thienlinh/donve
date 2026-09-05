// Card-grid pattern common to blog/resource landing templates (e.g. ThemeWagon's
// blog/education category) — adapted here as a typed catalog component, not copied markup.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

const articleSchema = z.object({
  title: z.string().max(120),
  excerpt: z.string().max(200),
  image: imagePropsSchema,
  href: z.string(),
  tag: z.string().max(40).optional(),
  date: z.string().max(40).optional()
});

export const blogArticleGridVariantValues = ["grid_3col", "list"] as const;

export const blogArticleGridPropsSchema = z.object({
  heading: z.string().max(80).optional(),
  articles: z.array(articleSchema).min(2).max(12),
  variant: z.enum(blogArticleGridVariantValues)
});
export type BlogArticleGridProps = z.infer<typeof blogArticleGridPropsSchema>;

export function BlogArticleGridRender({
  props
}: BaseComponentProps<BlogArticleGridProps>) {
  const isList = props.variant === "list";
  return (
    <section
      data-lp-component="blog_article_grid"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-center font-[family-name:var(--lp-font-heading)] text-2xl font-medium text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <div
        className={
          isList
            ? "mx-auto flex max-w-3xl flex-col gap-6"
            : "grid gap-8 md:grid-cols-3"
        }
      >
        {props.articles.map((article, index) => (
          <a
            key={index}
            href={article.href}
            className={
              isList
                ? "flex gap-4 rounded-[var(--lp-radius)]"
                : "flex flex-col gap-4 rounded-[var(--lp-radius)]"
            }
          >
            <img
              src={article.image.src}
              alt={article.image.alt}
              className={
                isList
                  ? "h-24 w-32 shrink-0 rounded-[var(--lp-radius)] object-cover"
                  : "aspect-video w-full rounded-[var(--lp-radius)] object-cover"
              }
            />
            <div className="flex flex-col gap-2">
              {article.tag || article.date ? (
                <div className="flex items-center gap-2 text-xs text-[var(--lp-color-primary)]">
                  {article.tag ? <span>{article.tag}</span> : null}
                  {article.tag && article.date ? <span>&middot;</span> : null}
                  {article.date ? (
                    <span className="text-[var(--lp-color-muted)]">
                      {article.date}
                    </span>
                  ) : null}
                </div>
              ) : null}
              <h3 className="font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)]">
                {article.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--lp-color-muted)]">
                {article.excerpt}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export const blogArticleGridMeta: ComponentMeta = {
  componentId: "blog_article_grid",
  category: "Content",
  variants: blogArticleGridVariantValues,
  purpose: ["understanding", "proof"],
  trackingEvents: [],
  sensitiveProps: []
};
