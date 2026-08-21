import { defineConfig } from "tsdown";

// IIFE, not the default ESM — this bundle is injected as a plain <script> into published
// landing HTML (architecture.md §5.2, tech-stack.md), not imported as a module by other code.
export default defineConfig({
  entry: ["src/index.ts"],
  format: "iife",
  minify: true,
  platform: "browser",
  dts: false
});
