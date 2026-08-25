import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Tiny static file server for `e2e/previews/` — each preview's CSS `<link>` is an absolute path
 * (`/assets/<hash>.css`, exactly what a real published page ships), so `file://` navigation
 * can't resolve it; this gives Playwright a real origin to request against instead. Started by
 * Playwright's own `webServer` config (`playwright.config.ts`), not run standalone.
 */
const root = fileURLToPath(new URL("./previews", import.meta.url));
const port = Number(process.env.PORT ?? 4173);

const MIME_BY_EXT: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json"
};

Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const relativePath =
      url.pathname === "/" || url.pathname.endsWith("/")
        ? `${url.pathname}index.html`
        : url.pathname;
    const resolved = path.join(root, relativePath);
    // Dev-only static server (never deployed) — still worth a trivial traversal guard.
    if (!resolved.startsWith(root))
      return new Response("Not found", { status: 404 });

    const file = Bun.file(resolved);
    if (!(await file.exists()))
      return new Response("Not found", { status: 404 });

    const ext = relativePath.slice(relativePath.lastIndexOf("."));
    return new Response(file, {
      headers: {
        "content-type": MIME_BY_EXT[ext] ?? "application/octet-stream"
      }
    });
  }
});

console.log(`Preview server listening on http://localhost:${port}`);
