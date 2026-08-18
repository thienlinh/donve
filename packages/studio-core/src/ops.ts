import type { Srcmap } from "./srcmap.js";
import type { PatchOp } from "./types.js";

const HIDDEN_ATTR = "data-cc-hidden";
const NAME_ATTR = "data-cc-name";

function parseFragmentNodes(doc: Document, html: string): ChildNode[] {
  const container = doc.createElement("div");
  container.innerHTML = html;
  return Array.from(container.childNodes);
}

function parseFragmentElement(doc: Document, html: string): Element | null {
  const container = doc.createElement("div");
  container.innerHTML = html;
  return container.firstElementChild;
}

/**
 * Applies `op` to the DOM/srcmap and returns a closure that undoes it.
 * Returns `null` when the op targets an id no longer in the srcmap
 * (e.g. patching an already-removed element) — a safe no-op, never a throw.
 */
export function applyOp(srcmap: Srcmap, op: PatchOp): (() => void) | null {
  switch (op.type) {
    case "replaceText": {
      const el = srcmap.get(op.srcmapId);
      if (!el) return null;
      const prev = el.textContent ?? "";
      el.textContent = op.text;
      return () => {
        el.textContent = prev;
      };
    }

    case "setStyle": {
      const el = srcmap.get(op.srcmapId);
      if (!el) return null;
      const styled = el as HTMLElement;
      const prev = styled.style.getPropertyValue(op.prop);
      if (op.value === null) styled.style.removeProperty(op.prop);
      else styled.style.setProperty(op.prop, op.value);
      return () => {
        if (prev) styled.style.setProperty(op.prop, prev);
        else styled.style.removeProperty(op.prop);
      };
    }

    case "setAttr": {
      const el = srcmap.get(op.srcmapId);
      if (!el) return null;
      const prev = el.getAttribute(op.attr);
      if (op.value === null) el.removeAttribute(op.attr);
      else el.setAttribute(op.attr, op.value);
      return () => {
        if (prev === null) el.removeAttribute(op.attr);
        else el.setAttribute(op.attr, prev);
      };
    }

    case "toggleVisibility": {
      const el = srcmap.get(op.srcmapId);
      if (!el) return null;
      const styled = el as HTMLElement;
      const prevDisplay = styled.style.getPropertyValue("display");
      const prevHidden = el.getAttribute(HIDDEN_ATTR);
      if (op.hidden) {
        styled.style.setProperty("display", "none");
        el.setAttribute(HIDDEN_ATTR, "true");
      } else {
        if (prevDisplay === "none") styled.style.removeProperty("display");
        el.removeAttribute(HIDDEN_ATTR);
      }
      return () => {
        if (prevDisplay) styled.style.setProperty("display", prevDisplay);
        else styled.style.removeProperty("display");
        if (prevHidden === null) el.removeAttribute(HIDDEN_ATTR);
        else el.setAttribute(HIDDEN_ATTR, prevHidden);
      };
    }

    case "renameLayer": {
      const el = srcmap.get(op.srcmapId);
      if (!el) return null;
      const prev = el.getAttribute(NAME_ATTR);
      el.setAttribute(NAME_ATTR, op.name);
      return () => {
        if (prev === null) el.removeAttribute(NAME_ATTR);
        else el.setAttribute(NAME_ATTR, prev);
      };
    }

    case "remove": {
      const el = srcmap.get(op.srcmapId);
      if (!el?.parentNode) return null;
      const parent = el.parentNode;
      const next = el.nextSibling;
      srcmap.forget(el);
      parent.removeChild(el);
      return () => {
        parent.insertBefore(el, next);
        srcmap.build(el);
      };
    }

    case "insertBefore":
    case "insertAfter": {
      const anchor = srcmap.get(op.srcmapId);
      if (!anchor?.parentNode) return null;
      const parent = anchor.parentNode;
      const nodes = parseFragmentNodes(anchor.ownerDocument, op.html);
      if (nodes.length === 0) return null;
      const ref = op.type === "insertBefore" ? anchor : anchor.nextSibling;
      for (const node of nodes) parent.insertBefore(node, ref);
      for (const node of nodes) {
        if (node.nodeType === 1) srcmap.build(node as Element);
      }
      return () => {
        for (const node of nodes) {
          if (node.nodeType === 1) srcmap.forget(node as Element);
          parent.removeChild(node);
        }
      };
    }

    case "replaceOuterHTML": {
      const el = srcmap.get(op.srcmapId);
      if (!el?.parentNode) return null;
      const parent = el.parentNode;
      const replacement = parseFragmentElement(el.ownerDocument, op.html);
      if (!replacement) return null;
      srcmap.forget(el);
      parent.replaceChild(replacement, el);
      srcmap.build(replacement);
      return () => {
        srcmap.forget(replacement);
        parent.replaceChild(el, replacement);
        srcmap.build(el);
      };
    }

    case "moveBefore": {
      const el = srcmap.get(op.srcmapId);
      if (!el?.parentNode) return null;
      const parent = el.parentNode;
      const prevNext = el.nextSibling;
      const ref = op.beforeSrcmapId ? srcmap.get(op.beforeSrcmapId) : null;
      if (op.beforeSrcmapId && (!ref || ref.parentNode !== parent)) return null;
      parent.insertBefore(el, ref ?? null);
      return () => {
        parent.insertBefore(el, prevNext);
      };
    }
  }
}
