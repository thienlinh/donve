import path from "path";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Must run before react() — generates routeTree.gen.ts and, with
    // autoCodeSplitting, gives each route its own chunk (NFR-02).
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    // NFR-07: compiles messages/{locale}.json into tree-shaken TS functions
    // at build time — no runtime i18n lib shipped to the client.
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "baseLocale"],
      emitTsDeclarations: true,
      // Pinned explicitly: the compiler's own default is `message-modules` (one file per
      // message), which doesn't match what's committed under `src/paraglide` — without this,
      // any dev/build run regenerates the whole tree into ~2k per-message files instead of the
      // three-file-per-locale shape this repo commits.
      outputStructure: "locale-modules",
      // `src/paraglide` is committed (see repo note in that dir) so `tsc`
      // can resolve it without a `vite build` bootstrap step first — the
      // default self-gitignore would fight that.
      emitGitIgnore: false
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src")
    }
  },
  build: { target: "baseline-widely-available" }
});
