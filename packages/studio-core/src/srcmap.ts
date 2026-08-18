const ID_ATTR = "data-cc-id";
const ID_PREFIX = "cc-";

const SKIP_TAGS = new Set([
  "script",
  "style",
  "template",
  "head",
  "meta",
  "link",
  "title",
  "base",
  "noscript"
]);

/**
 * id -> node cache for O(1) patch lookup (studio-builder-spec.md §11).
 * Ids are stable across re-parses: they live on the element itself
 * (`data-cc-id`), so serializing to HTML and parsing it back preserves them.
 */
export class Srcmap {
  static readonly idAttr = ID_ATTR;

  #nodes = new Map<string, Element>();
  #seq = 1;

  get(id: string): Element | undefined {
    return this.#nodes.get(id);
  }

  /** Walk `root` and its descendants, assigning/registering stable ids. */
  build(root: Element): void {
    if (!SKIP_TAGS.has(root.tagName.toLowerCase())) {
      this.#register(root);
    }
    for (const child of Array.from(root.children)) {
      this.build(child);
    }
  }

  /** Drop `root` and its descendants from the id -> node map (tombstone). */
  forget(root: Element): void {
    const id = root.getAttribute(ID_ATTR);
    if (id) this.#nodes.delete(id);
    for (const child of Array.from(root.children)) {
      this.forget(child);
    }
  }

  #register(el: Element): string {
    const existing = el.getAttribute(ID_ATTR);
    if (existing) {
      this.#nodes.set(existing, el);
      const n = Number(existing.slice(ID_PREFIX.length));
      if (Number.isFinite(n) && n >= this.#seq) this.#seq = n + 1;
      return existing;
    }
    const id = `${ID_PREFIX}${this.#seq++}`;
    el.setAttribute(ID_ATTR, id);
    this.#nodes.set(id, el);
    return id;
  }
}

export function buildSrcmap(root: Element): Srcmap {
  const srcmap = new Srcmap();
  srcmap.build(root);
  return srcmap;
}
