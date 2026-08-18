import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";

import { PatchHistory } from "../src/history.js";
import { applyOpsToHtml } from "../src/html.js";
import { applyOp } from "../src/ops.js";
import { buildSrcmap } from "../src/srcmap.js";

const FIXTURE = `<!doctype html><html><body>
  <section><h1>Title</h1><p>Body</p><span>Span</span></section>
  <aside><em>Other</em></aside>
</body></html>`;

function setup(html = FIXTURE) {
  const { document } = parseHTML(html);
  const srcmap = buildSrcmap(document.documentElement);
  return { document, srcmap };
}

describe("srcmap", () => {
  it("assigns stable ids and is O(1)-lookupable", () => {
    const { document, srcmap } = setup();
    const h1 = document.querySelector("h1")!;
    const id = h1.getAttribute("data-cc-id")!;
    expect(id).toMatch(/^cc-\d+$/);
    expect(srcmap.get(id)).toBe(h1);
  });

  it("reuses existing ids on re-parse instead of minting new ones", () => {
    const first = setup();
    const html = String(first.document);
    const second = setup(html);
    const h1First = first.document
      .querySelector("h1")!
      .getAttribute("data-cc-id");
    const h1Second = second.document
      .querySelector("h1")!
      .getAttribute("data-cc-id");
    expect(h1Second).toBe(h1First);
  });
});

describe("PatchHistory", () => {
  it("applies replaceText and undoes/redoes it", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({ type: "replaceText", srcmapId: id, text: "Changed" });
    expect(p.textContent).toBe("Changed");

    expect(history.undo()).toBe(true);
    expect(p.textContent).toBe("Body");

    expect(history.redo()).toBe(true);
    expect(p.textContent).toBe("Changed");
  });

  it("no-ops safely when patching an element removed by an earlier op", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({ type: "remove", srcmapId: id });
    expect(() =>
      history.commit({ type: "replaceText", srcmapId: id, text: "x" })
    ).not.toThrow();
    expect(document.querySelector("p")).toBeNull();
  });

  it("undoes remove back to the original position", () => {
    const { document, srcmap } = setup();
    const h1 = document.querySelector("h1")!;
    const span = document.querySelector("span")!;
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({ type: "remove", srcmapId: id });
    expect(document.querySelector("p")).toBeNull();

    history.undo();
    expect(document.querySelector("p")?.textContent).toBe("Body");
    expect(h1.nextSibling).toBe(p);
    expect(p.nextSibling).toBe(span);
  });

  it("caps the undo stack at maxEntries", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap, 3);

    for (let i = 0; i < 5; i++) {
      history.commit({ type: "replaceText", srcmapId: id, text: `v${i}` });
    }
    let undone = 0;
    while (history.undo()) undone++;
    expect(undone).toBe(3);
  });

  it("inserts new markup and assigns it a fresh srcmap id", () => {
    const { document, srcmap } = setup();
    const section = document.querySelector("section")!;
    const id = section.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({
      type: "insertAfter",
      srcmapId: id,
      html: "<footer>Footer</footer>"
    });
    const footer = document.querySelector("footer")!;
    expect(footer.getAttribute("data-cc-id")).toMatch(/^cc-\d+$/);
    expect(srcmap.get(footer.getAttribute("data-cc-id"))).toBe(footer);

    history.undo();
    expect(document.querySelector("footer")).toBeNull();
  });
});

describe("applyOpsToHtml", () => {
  it("applies ops to a raw HTML string (server-side validate path)", () => {
    const { document } = setup();
    const h1 = document.querySelector("h1")!;
    const id = h1.getAttribute("data-cc-id")!;

    const result = applyOpsToHtml(String(document), [
      { type: "replaceText", srcmapId: id, text: "New Title" }
    ]);

    expect(result).toContain("New Title");
    expect(result).not.toContain(">Title<");
  });
});

describe("setStyle", () => {
  it("undo removes a property that didn't exist before (not reset to empty)", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "setStyle",
      srcmapId: id,
      prop: "color",
      value: "red"
    });
    expect(p.style.getPropertyValue("color")).toBe("red");

    undo!();
    expect(p.style.getPropertyValue("color")).toBe("");
    expect(p.getAttribute("style") ?? "").not.toContain("color");
  });

  it("undo restores the previous value when overwriting an existing property", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    p.style.setProperty("color", "blue");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "setStyle",
      srcmapId: id,
      prop: "color",
      value: "red"
    });
    expect(p.style.getPropertyValue("color")).toBe("red");

    undo!();
    expect(p.style.getPropertyValue("color")).toBe("blue");
  });

  it("value: null removes the property; undo restores it", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    p.style.setProperty("color", "blue");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "setStyle",
      srcmapId: id,
      prop: "color",
      value: null
    });
    expect(p.style.getPropertyValue("color")).toBe("");

    undo!();
    expect(p.style.getPropertyValue("color")).toBe("blue");
  });
});

describe("setAttr", () => {
  it("undo removes an attribute that didn't exist before", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "setAttr",
      srcmapId: id,
      attr: "title",
      value: "hello"
    });
    expect(p.getAttribute("title")).toBe("hello");

    undo!();
    expect(p.hasAttribute("title")).toBe(false);
  });

  it("undo restores the previous value when overwriting an existing attribute", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    p.setAttribute("title", "original");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "setAttr",
      srcmapId: id,
      attr: "title",
      value: "new"
    });
    expect(p.getAttribute("title")).toBe("new");

    undo!();
    expect(p.getAttribute("title")).toBe("original");
  });

  it("value: null removes the attribute; undo restores it", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    p.setAttribute("title", "original");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "setAttr",
      srcmapId: id,
      attr: "title",
      value: null
    });
    expect(p.hasAttribute("title")).toBe(false);

    undo!();
    expect(p.getAttribute("title")).toBe("original");
  });
});

describe("toggleVisibility", () => {
  it("hides an element with no prior display style; undo removes display and the hidden marker entirely", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "toggleVisibility",
      srcmapId: id,
      hidden: true
    });
    expect(p.style.getPropertyValue("display")).toBe("none");
    expect(p.getAttribute("data-cc-hidden")).toBe("true");

    undo!();
    expect(p.style.getPropertyValue("display")).toBe("");
    expect(p.hasAttribute("data-cc-hidden")).toBe(false);
  });

  it("preserves a pre-existing display value across hide/undo", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    p.style.setProperty("display", "flex");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "toggleVisibility",
      srcmapId: id,
      hidden: true
    });
    expect(p.style.getPropertyValue("display")).toBe("none");

    undo!();
    expect(p.style.getPropertyValue("display")).toBe("flex");
    expect(p.hasAttribute("data-cc-hidden")).toBe(false);
  });

  it("un-hiding an already-none display leaves display alone but clears the hidden marker", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    p.style.setProperty("display", "none");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "toggleVisibility",
      srcmapId: id,
      hidden: false
    });
    expect(p.style.getPropertyValue("display")).toBe("");
    expect(p.hasAttribute("data-cc-hidden")).toBe(false);

    undo!();
    expect(p.style.getPropertyValue("display")).toBe("none");
  });
});

describe("renameLayer", () => {
  it("undo removes the name attribute that didn't exist before", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "renameLayer",
      srcmapId: id,
      name: "Body copy"
    });
    expect(p.getAttribute("data-cc-name")).toBe("Body copy");

    undo!();
    expect(p.hasAttribute("data-cc-name")).toBe(false);
  });

  it("undo restores the previous name when renaming twice", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    p.setAttribute("data-cc-name", "Original");
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "renameLayer",
      srcmapId: id,
      name: "Renamed"
    });
    expect(p.getAttribute("data-cc-name")).toBe("Renamed");

    undo!();
    expect(p.getAttribute("data-cc-name")).toBe("Original");
  });
});

describe("replaceOuterHTML", () => {
  it("swaps in new markup at the same position; undo restores the exact original element", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const span = document.querySelector("span")!;
    const id = p.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "replaceOuterHTML",
      srcmapId: id,
      html: "<blockquote>Quoted</blockquote>"
    });
    expect(document.querySelector("p")).toBeNull();
    const quote = document.querySelector("blockquote")!;
    expect(quote.textContent).toBe("Quoted");
    expect(quote.nextSibling).toBe(span);

    undo!();
    const restored = document.querySelector("p")!;
    expect(restored).toBe(p);
    expect(restored.textContent).toBe("Body");
    expect(restored.nextSibling).toBe(span);
    expect(document.querySelector("blockquote")).toBeNull();
  });
});

describe("insertBefore / insertAfter", () => {
  it("insertBefore places new nodes ahead of the anchor; undo removes exactly those nodes", () => {
    const { document, srcmap } = setup();
    const h1 = document.querySelector("h1")!;
    const id = h1.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "insertBefore",
      srcmapId: id,
      html: "<nav>Nav</nav>"
    });
    const nav = document.querySelector("nav")!;
    expect(nav.nextSibling).toBe(h1);

    undo!();
    expect(document.querySelector("nav")).toBeNull();
    expect(document.querySelector("h1")).toBe(h1);
  });

  it("insertAfter places new nodes right after the anchor; undo removes exactly those nodes", () => {
    const { document, srcmap } = setup();
    const h1 = document.querySelector("h1")!;
    const p = document.querySelector("p")!;
    const id = h1.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "insertAfter",
      srcmapId: id,
      html: "<em>One</em><em>Two</em>"
    });
    const inserted = document.querySelectorAll("em");
    expect(inserted).toHaveLength(3); // 2 new + 1 pre-existing in <aside>
    expect(h1.nextSibling).toBe(inserted[0]);
    expect(inserted[0]!.nextSibling).toBe(inserted[1]);
    expect(inserted[1]!.nextSibling).toBe(p);

    undo!();
    expect(document.querySelectorAll("em")).toHaveLength(1);
    expect(h1.nextSibling).toBe(p);
  });
});

describe("moveBefore", () => {
  it("reorders within the same parent; undo restores the original position", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const h1 = document.querySelector("h1")!;
    const span = document.querySelector("span")!;
    const h1Id = h1.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "moveBefore",
      srcmapId: span.getAttribute("data-cc-id")!,
      beforeSrcmapId: h1Id
    });
    expect(span.nextSibling).toBe(h1);

    undo!();
    expect(h1.nextSibling).toBe(p);
    expect(p.nextSibling).toBe(span);
  });

  it("beforeSrcmapId: null moves the element to the end of its parent; undo restores position", () => {
    const { document, srcmap } = setup();
    const h1 = document.querySelector("h1")!;
    const p = document.querySelector("p")!;
    const span = document.querySelector("span")!;
    const id = h1.getAttribute("data-cc-id")!;

    const undo = applyOp(srcmap, {
      type: "moveBefore",
      srcmapId: id,
      beforeSrcmapId: null
    });
    const section = document.querySelector("section")!;
    expect(section.lastElementChild).toBe(h1);

    undo!();
    expect(h1.nextSibling).toBe(p);
    expect(p.nextSibling).toBe(span);
  });

  it("rejects a move whose reference element lives in a different parent (no silent-fail)", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const em = document.querySelector("em")!;
    const pId = p.getAttribute("data-cc-id")!;
    const emId = em.getAttribute("data-cc-id")!;
    const pParent = p.parentNode;
    const pNext = p.nextSibling;

    const result = applyOp(srcmap, {
      type: "moveBefore",
      srcmapId: pId,
      beforeSrcmapId: emId
    });

    expect(result).toBeNull();
    expect(p.parentNode).toBe(pParent);
    expect(p.nextSibling).toBe(pNext);
  });
});

describe("patching an element removed by an earlier op is a safe no-op", () => {
  const cases: Array<{
    name: string;
    op: (id: string, otherId: string) => import("../src/types.js").PatchOp;
  }> = [
    {
      name: "replaceText",
      op: (id) => ({ type: "replaceText", srcmapId: id, text: "x" })
    },
    {
      name: "setStyle",
      op: (id) => ({
        type: "setStyle",
        srcmapId: id,
        prop: "color",
        value: "red"
      })
    },
    {
      name: "setAttr",
      op: (id) => ({ type: "setAttr", srcmapId: id, attr: "title", value: "x" })
    },
    {
      name: "toggleVisibility",
      op: (id) => ({ type: "toggleVisibility", srcmapId: id, hidden: true })
    },
    {
      name: "renameLayer",
      op: (id) => ({ type: "renameLayer", srcmapId: id, name: "x" })
    },
    { name: "remove", op: (id) => ({ type: "remove", srcmapId: id }) },
    {
      name: "replaceOuterHTML",
      op: (id) => ({ type: "replaceOuterHTML", srcmapId: id, html: "<b>x</b>" })
    },
    {
      name: "insertBefore",
      op: (id) => ({ type: "insertBefore", srcmapId: id, html: "<b>x</b>" })
    },
    {
      name: "insertAfter",
      op: (id) => ({ type: "insertAfter", srcmapId: id, html: "<b>x</b>" })
    },
    {
      name: "moveBefore",
      op: (id, otherId) => ({
        type: "moveBefore",
        srcmapId: id,
        beforeSrcmapId: otherId
      })
    }
  ];

  for (const { name, op } of cases) {
    it(`${name} on an already-removed target returns null and does not throw`, () => {
      const { document, srcmap } = setup();
      const p = document.querySelector("p")!;
      const h1 = document.querySelector("h1")!;
      const id = p.getAttribute("data-cc-id")!;
      const h1Id = h1.getAttribute("data-cc-id")!;

      applyOp(srcmap, { type: "remove", srcmapId: id });
      expect(srcmap.get(id)).toBeUndefined();

      let result: (() => void) | null | undefined;
      expect(() => {
        result = applyOp(srcmap, op(id, h1Id));
      }).not.toThrow();
      expect(result).toBeNull();
    });
  }

  it("PatchHistory.commit also swallows the no-op without recording it", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({ type: "remove", srcmapId: id });
    expect(history.canUndo()).toBe(true);

    expect(() =>
      history.commit({ type: "replaceText", srcmapId: id, text: "x" })
    ).not.toThrow();

    // only the remove was recorded — undoing once already exhausts the stack
    expect(history.undo()).toBe(true);
    expect(history.undo()).toBe(false);
  });
});

describe("overlapping patches on the same srcmap id undo in strict LIFO order", () => {
  it("two ops of the same type step back one value at a time, never jumping to the original", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    p.setAttribute("title", "original");
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({
      type: "setAttr",
      srcmapId: id,
      attr: "title",
      value: "A"
    });
    history.commit({
      type: "setAttr",
      srcmapId: id,
      attr: "title",
      value: "B"
    });
    expect(p.getAttribute("title")).toBe("B");

    expect(history.undo()).toBe(true);
    expect(p.getAttribute("title")).toBe("A");

    expect(history.undo()).toBe(true);
    expect(p.getAttribute("title")).toBe("original");
  });

  it("two ops of different types on the same element undo independently in reverse order", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p") as HTMLElement;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);

    history.commit({ type: "replaceText", srcmapId: id, text: "Changed" });
    history.commit({
      type: "setStyle",
      srcmapId: id,
      prop: "color",
      value: "red"
    });
    expect(p.textContent).toBe("Changed");
    expect(p.style.getPropertyValue("color")).toBe("red");

    // undoing the style op must not touch the text, and vice versa
    expect(history.undo()).toBe(true);
    expect(p.style.getPropertyValue("color")).toBe("");
    expect(p.textContent).toBe("Changed");

    expect(history.undo()).toBe(true);
    expect(p.textContent).toBe("Body");
  });
});

describe("PatchHistory undo-stack capacity (default 100 entries)", () => {
  it("drops the oldest entry once more than 100 ops are committed, without erroring", () => {
    const { document, srcmap } = setup();
    const p = document.querySelector("p")!;
    const id = p.getAttribute("data-cc-id")!;
    const history = new PatchHistory(srcmap);
    const totalOps = 105;

    for (let i = 0; i < totalOps; i++) {
      history.commit({ type: "replaceText", srcmapId: id, text: `v${i}` });
    }
    expect(p.textContent).toBe(`v${totalOps - 1}`);

    let undone = 0;
    while (history.undo()) undone++;

    // only the most recent 100 commits are undoable; the first 5 (v0..v4) were evicted
    expect(undone).toBe(100);
    expect(p.textContent).toBe("v4");
    expect(history.undo()).toBe(false);
  });
});
