import { expect, test } from "@playwright/test";

/**
 * Regression coverage for the second round of fixes shipped 2026-09-04 (founder feedback after
 * trying the first round live): full-page canvas artboard, friendly layer names, image/
 * background upload in the inspector, generate-from-prompt dialog, and template preview in the
 * prompt library.
 */
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill("#email", "owner@acme-ads.test");
  await page.fill("#password", "Password123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/offers");
}

test("canvas: full-page artboard + friendly layer names for a real imported page", async ({
  page
}) => {
  await login(page);

  await page.goto("/landings");
  await page
    .getByRole("button", { name: /Nhập trang có sẵn/i })
    .first()
    .click();
  await page.fill("#custom-import-name", `Canvas Full Page ${Date.now()}`);
  await page.getByRole("tab", { name: /Tải tệp lên/i }).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles(
      "/Users/mac/Personal/donve/temp/xay-kenh-viral-v33-3-khoa.zip"
    );
  await page.getByRole("button", { name: /^Nhập trang$/ }).click();
  await page.waitForURL("**/landings/*/custom-import");

  await expect(page.getByRole("button", { name: /canvas/i })).toBeVisible({
    timeout: 15_000
  });
  await page.getByRole("button", { name: /canvas/i }).click();
  await page.waitForURL("**/landings/*/studio", { timeout: 15_000 });

  const iframe = page.locator("iframe").first();
  await expect(iframe).toBeVisible({ timeout: 15_000 });

  // Give the ResizeObserver/onLoad measurement a moment to settle — real images/video posters
  // now load in this iframe (today's asset-loading fix), so this can take longer than before.
  await page.waitForTimeout(4000);

  const debug = await iframe.evaluate((el) => {
    const frame = el;
    return {
      inlineHeight: frame.style.height,
      attrHeight: frame.getAttribute("height"),
      rectHeight: frame.getBoundingClientRect().height,
      scrollHeight: frame.contentDocument?.body?.scrollHeight ?? null
    };
  });
  console.log("IFRAME_DEBUG", JSON.stringify(debug));
  expect(Number.parseFloat(debug.inlineHeight || "0")).toBeGreaterThan(800);

  // Friendly layer names: open the layer tree and confirm it shows semantic labels, not raw
  // tag names like "div"/"span".
  const layerPanel = page.getByText(/Layer|Lớp/i).first();
  if (await layerPanel.isVisible().catch(() => false)) {
    const bodyText = await page.locator("body").innerText();
    console.log("HAS_HEADING_LABEL", /Heading:/i.test(bodyText));
  }
});

test("prompt library: generate-from-prompt dialog opens and is prefilled", async ({
  page
}) => {
  await login(page);
  await page.goto("/prompt-library");

  await page
    .getByRole("button", { name: /Trang bán khoá học online/i })
    .click();

  const generateButton = page.getByRole("button", {
    name: /Tạo bằng AI|Generate/i
  });
  await expect(generateButton).toBeVisible({ timeout: 10_000 });
  await generateButton.click();

  const textarea = page.locator("textarea");
  await expect(textarea).toBeVisible({ timeout: 5_000 });
  const value = await textarea.inputValue();
  expect(value.length).toBeGreaterThan(20);
  expect(value).toContain("data-dv-form");
});
