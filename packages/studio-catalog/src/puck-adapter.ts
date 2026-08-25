import type { Spec } from "@json-render/core";
import type { Data } from "@puckeditor/core";

/**
 * PageSpec ⇄ Puck Data, both directions. PageSpec stays the canonical, DB-persisted, AI-facing
 * format (every AI agent — Page Architect, Content Agent, Auto Fixer, Quality Critic, Convert-
 * to-native — reads/writes it directly); Puck only ever sees a derived view. This is a flat
 * list-to-list mapping, not a tree transform: every catalog component declares `slots: []`
 * (`catalog.ts`), so `page_root.children` already is the full ordered section list — it maps
 * 1:1 onto Puck's `content` array, no `zones` needed.
 */

export function pageSpecToPuckData(spec: Spec): Data {
  const rootElement = spec.elements[spec.root];
  const childIds = rootElement?.children ?? [];

  return {
    root: { props: {} },
    content: childIds.flatMap((elementId) => {
      const element = spec.elements[elementId];
      if (!element) return [];
      return [
        {
          type: element.type,
          props: { ...element.props, id: elementId }
        }
      ];
    })
  };
}

/** `previousSpec` supplies the root element's own props/type (unaffected by editing — Puck only
 * ever sees the root's children, never the root itself) so nothing about it is lost on save. */
export function puckDataToPageSpec(data: Data, previousSpec: Spec): Spec {
  const elements: Spec["elements"] = {};
  const children: string[] = [];

  for (const item of data.content) {
    const { id, ...props } = item.props as Record<string, unknown> & {
      id: string;
    };
    elements[id] = { type: item.type, props, children: [] };
    children.push(id);
  }

  const previousRoot = previousSpec.elements[previousSpec.root];
  elements[previousSpec.root] = {
    type: previousRoot?.type ?? "page_root",
    props: previousRoot?.props ?? {},
    children
  };

  return { root: previousSpec.root, elements };
}
