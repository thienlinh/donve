import { exampleProps } from "@dv/studio-catalog";
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 }
] as const;

/**
 * `roadmap/roadmap.md` §Component Library: "mỗi component render đúng 3 breakpoint... có golden
 * screenshot." First run (or after a deliberate visual change) needs
 * `bunx playwright test --update-snapshots` to capture/refresh the baseline; CI just compares
 * against what's committed under `e2e/__screenshots__/`.
 */
for (const componentId of Object.keys(exampleProps)) {
  test.describe(componentId, () => {
    for (const viewport of VIEWPORTS) {
      test(`renders correctly at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });
        await page.goto(`/${componentId}/`);
        await expect(
          page.locator(`[data-lp-component="${componentId}"]`)
        ).toHaveScreenshot(`${componentId}-${viewport.name}.png`);
      });
    }
  });
}
