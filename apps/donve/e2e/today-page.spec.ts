import { expect, test } from "@playwright/test";

/**
 * Manual smoke check for the Layer-1 "Hôm nay" queue consolidation (docs/product/roadmap.md
 * §Lớp 1) — not part of the committed regression suite (no seed data setup), run ad hoc against
 * a dev stack to eyeball that the merged queue renders without runtime errors and respects the
 * fulfillment > lead > payment priority order end to end through the real UI.
 */
test("today page renders the merged priority queue without console errors", async ({
  page
}) => {
  // Filters a known, pre-existing, unrelated warning: `Button render={<Link .../>}`
  // (used app-wide, unchanged by this page) trips Base UI's `nativeButton` check —
  // a real issue, but in `@dv/ui`'s Button, out of scope for this page's changes.
  const KNOWN_UNRELATED =
    "Base UI: A component that acts as a button expected a native";
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes(KNOWN_UNRELATED)) {
      errors.push(msg.text());
    }
  });

  await page.goto("/login");
  await page.fill("#email", "owner@acme-ads.test");
  await page.fill("#password", "Password123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/offers");

  await page.goto("/today");
  await expect(page.getByText("Việc cần chú ý")).toBeVisible();
  await expect(page.getByText("Nhịp vận hành hôm nay")).toBeVisible();
  await expect(page.getByText("Nguồn tạo đơn")).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});
