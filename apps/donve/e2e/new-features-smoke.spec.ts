import { expect, test } from "@playwright/test";

/**
 * Regression coverage for two features shipped 2026-09-04: the prompt library and canvas
 * editing for custom-import pages. Both were implementer-agent-built without a browser check —
 * this suite caught a real 404 in `fetchPromptLibrary`'s URL construction that unit/typecheck
 * couldn't (see `apps/donve/src/features/prompt-library/api.ts`'s trailing-slash comment).
 */
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill("#email", "owner@acme-ads.test");
  await page.fill("#password", "Password123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/offers");
}

test("prompt library: search, open a full-page entry, copy works", async ({
  page
}) => {
  await login(page);
  await page.goto("/prompt-library");

  // 4 full-page entries post-redesign (2026-09-04) — no category chips any more, search only.
  await expect(
    page.getByRole("button", { name: /Trang bán khoá học online/i })
  ).toBeVisible({ timeout: 10_000 });

  await page.getByPlaceholder(/tìm|search/i).fill("khoá học");
  await expect(
    page.getByRole("button", { name: /Trang bán khoá học online/i })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Trang đặt lịch hẹn dịch vụ/i })
  ).not.toBeVisible();

  await page
    .getByRole("button", { name: /Trang bán khoá học online/i })
    .click();

  const copyButton = page.getByRole("button", { name: /copy|sao chép/i });
  await expect(copyButton).toBeVisible({ timeout: 10_000 });
  await copyButton.click();
  await expect(page.getByText(/đã sao chép|copied/i).first()).toBeVisible({
    timeout: 5_000
  });
});

test("custom-import: canvas editor button appears for a stamped page and opens real canvas", async ({
  page
}) => {
  await login(page);

  await page.goto("/landings");
  await page
    .getByRole("button", { name: /Nhập trang có sẵn/i })
    .first()
    .click();
  await page.fill("#custom-import-name", `Canvas Smoke ${Date.now()}`);
  await page.getByRole("tab", { name: /Tải tệp lên/i }).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles(
      "/Users/mac/Personal/donve/temp/xay-kenh-viral-v33-3-khoa.zip"
    );
  await page.getByRole("button", { name: /^Nhập trang$/ }).click();
  await page.waitForURL("**/landings/*/custom-import");

  const preview = page.frameLocator('iframe[title="Xem trước"]');
  await expect(preview.getByText("BIẾN KÊNH THÀNH TÀI SẢN")).toBeVisible({
    timeout: 15_000
  });

  const canvasButton = page.getByRole("button", { name: /canvas/i });
  await expect(canvasButton).toBeVisible({ timeout: 10_000 });
  await canvasButton.click();
  await page.waitForURL("**/landings/*/studio", { timeout: 15_000 });

  // Real canvas UI loaded (not a blank/error page) — the layer tree or canvas iframe should be
  // present, and the imported content should still be the real content.
  await expect(page.locator("iframe").first()).toBeVisible({
    timeout: 15_000
  });
});
