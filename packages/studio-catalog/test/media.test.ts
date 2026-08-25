import type { Spec } from "@json-render/core";
import { describe, expect, it } from "vitest";

import { renderSpecToHtml } from "../src/render.js";

function renderMedia(props: Record<string, unknown>): string {
  const spec: Spec = {
    root: "page-root",
    elements: {
      "page-root": { type: "page_root", props: {}, children: ["m"] },
      m: { type: "media", props, children: [] }
    }
  };
  return renderSpecToHtml(spec);
}

describe("media component", () => {
  it("turns a pasted YouTube/Vimeo URL of any shape into a real embed URL", () => {
    for (const url of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ"
    ]) {
      expect(renderMedia({ variant: "youtube", embedUrl: url })).toContain(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      );
    }
    expect(
      renderMedia({ variant: "vimeo", embedUrl: "https://vimeo.com/76979871" })
    ).toContain("https://player.vimeo.com/video/76979871");
  });

  it("renders nothing embeddable (but still a valid section) for an unparseable URL", () => {
    const html = renderMedia({
      variant: "youtube",
      embedUrl: "https://example.com/not-a-video"
    });
    expect(html).toContain('data-lp-component="media"');
    expect(html).not.toContain("<iframe");
  });

  it("puts the uploaded video URL on a <source> so publish can rewrite it", () => {
    const html = renderMedia({
      variant: "video_upload",
      video: { src: "/api/landings/lp1/assets/a1/file", poster: "/p.jpg" }
    });
    expect(html).toContain('<source src="/api/landings/lp1/assets/a1/file"');
    expect(html).toContain('poster="/p.jpg"');
  });
});
