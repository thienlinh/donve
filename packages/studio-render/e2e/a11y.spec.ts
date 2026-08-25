import { AxeBuilder } from "@axe-core/playwright";
import { exampleProps } from "@dv/studio-catalog";
import { expect, test } from "@playwright/test";

/**
 * `roadmap/roadmap.md` §Component Library: "pass a11y automation" — real axe-core run per
 * component against its own publish-fidelity preview (same page `golden-screenshot.spec.ts`
 * screenshots). WCAG 2.1 A/AA only; a real violation fails the test, this isn't advisory.
 */
for (const componentId of Object.keys(exampleProps)) {
  test(`${componentId} has no axe violations (WCAG 2.1 A/AA)`, async ({
    page
  }) => {
    await page.goto(`/${componentId}/`);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(
      results.violations,
      results.violations
        .map((v) => `${v.id}: ${v.description} (${v.nodes.length} node(s))`)
        .join("\n")
    ).toEqual([]);
  });
}
