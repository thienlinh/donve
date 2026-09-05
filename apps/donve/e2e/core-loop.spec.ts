import { expect, test, type Page } from "@playwright/test";

/**
 * Core revenue loop, real browser + real HTTP (architecture.md §5.2, FR-D-05):
 * custom-import upload → wire lead form → publish → visitor submits the lead form →
 * lead lands in the inbox → a synthetic SePay webhook (mirroring
 * apps/api/test/webhooks-sepay.integration.test.ts) pays the order → order desk shows it
 * paid and fulfillable.
 *
 * Requires the full dev stack already running: `bun run dev` from the repo root (api :3000,
 * donve :5173) plus Postgres/Redis (`docker compose up -d`) and seeded accounts
 * (`bun run apps/api/src/seed-accounts.ts`, see that file for the exact env vars).
 *
 * Known gap NOT covered here: the edge-router (`apps/edge-router`, CF Workers KV/R2) that
 * serves a *published* hostname in production runs as a separate `wrangler dev` process with
 * its own local KV/R2 simulation — the Bun/VPS api (`RUNTIME=bun`, used here) writes its
 * hostname pointer to Redis and its deployment bytes to the local filesystem instead
 * (`apps/api/src/lib/publish.ts` `createHostnamePointerStore`/`createDeploymentStorageDriver`),
 * so there is no live HTTP path from a published `https://<subdomain>.donve.local.test` to
 * anything actually running in this sandbox. This test verifies the `publish` API call itself
 * produced a real `deployments` row + hostname, then uses the pre-publish preview endpoint
 * (`POST /api/landings/:id/preview` → served back by `GET /public/preview/:token/*`, a real
 * route on the same api process, per `apps/api/src/modules/public/routes.ts`) for the actual
 * browser round-trip against the *same* build_deploy artifact publish would have shipped —
 * the closest thing to "hit the live URL" actually reachable here.
 */

const API_URL = "http://localhost:3000";
const OWNER_EMAIL = "owner@acme-ads.test";
const OWNER_PASSWORD = "Password123!";
const RUN_ID = Date.now().toString(36);

async function login(page: Page) {
  await page.goto("/login");
  await page.fill("#email", OWNER_EMAIL);
  await page.fill("#password", OWNER_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/offers");
}

test.describe("core revenue loop", () => {
  test.describe.configure({ mode: "serial" });

  // Real demo content, uploaded exactly as the founder ships it (custom-import's primary input
  // shape is a zip). This used to be a product-bug repro: the uploaded file's real name/phone/
  // email inputs (`<input id="f-name">`, `id="f-phone"`, `id="f-email"`, no `name` attribute — a
  // very common pattern for hand-rolled/AI-generated landing pages) were invisible to the
  // field-mapping wizard, because both `detectImportForms` and `wireLeadForm`
  // (apps/api/src/lib/custom-import.ts) only ever looked at each input's `name` attribute, never
  // `id`. Fixed 2026-09-04 (`fieldIdentifier()` falls back to `id`) — this test now proves the
  // real fixture wires end to end through the actual UI, not just via a synthetic minimal
  // fixture. Kept as its own test (rather than folded into the loop test below) since it's
  // specifically about the import/wire step, not the rest of the loop.
  test("custom-import: real uploaded zip renders and wires via id-only fields", async ({
    page
  }) => {
    await login(page);

    await page.goto("/landings");
    await page
      .getByRole("button", { name: /Nhập trang có sẵn/i })
      .first()
      .click();
    await page.fill("#custom-import-name", `Xay Kenh Viral ${RUN_ID}`);
    await page.getByRole("tab", { name: /Tải tệp lên/i }).click();
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        "/Users/mac/Personal/donve/temp/xay-kenh-viral-v33-3-khoa.zip"
      );
    await page.getByRole("button", { name: /^Nhập trang$/ }).click();
    await page.waitForURL("**/landings/*/custom-import");

    // The real HTML actually rendered inside the studio preview iframe — not just "a page
    // loaded", the real uploaded content is what's on screen.
    const preview = page.frameLocator('iframe[title="Xem trước"]');
    await expect(preview.getByText("BIẾN KÊNH THÀNH TÀI SẢN")).toBeVisible({
      timeout: 15_000
    });

    // Regression for a real bug found live 2026-09-04: this fixture's carousel images ship as
    // `<img data-src="...">` (no `src` at all — a lazy-load pattern meant to be swapped in by
    // JS the sanitizer always strips) *and* the page's own CSS carries
    // `img[data-src]{visibility:hidden}`. Fixed in `extractImageSources`
    // (packages/studio-core/src/image-extract.ts) to read from `data-src` when `src` is absent
    // and to strip `data-src` off once resolved — otherwise the asset loads fine but stays
    // permanently invisible. Assert on a real carousel image, not just "some image loaded".
    const carouselImg = preview.locator('img[alt="Kênh Phương Mai"]').first();
    await expect(carouselImg).toBeVisible({ timeout: 15_000 });
    await expect(carouselImg).toHaveAttribute("src", /^http/);
    await expect(carouselImg).not.toHaveAttribute("data-src", /.+/);

    // The id-only fields are now offered by the wizard alongside the named ones.
    const fullNameSelect = page.locator('button[role="combobox"]').first();
    await fullNameSelect.click();
    const options = await page.locator('[role="option"]').allTextContents();
    expect(options).toContain("f-name");
    expect(options).toContain("f-phone");
    expect(options).toContain("f-email");
    await page.keyboard.press("Escape");

    const selects = page.locator('button[role="combobox"]');
    const mapField = async (index: number, value: string) => {
      await selects.nth(index).click();
      await page.getByRole("option", { name: value, exact: true }).click();
    };
    await mapField(0, "f-name");
    await mapField(1, "f-phone");
    await mapField(2, "f-email");
    await page
      .getByRole("button", { name: "Kết nối biểu mẫu khách hàng" })
      .click();
    await expect(page.getByText("Đã kết nối").first()).toBeVisible({
      timeout: 10_000
    });
  });

  test("core loop: publish → lead capture → SePay webhook → fulfillment", async ({
    page,
    context
  }) => {
    await login(page);

    const suffix = `${RUN_ID}-loop`;
    const productName = `Khoá học E2E ${suffix}`;
    const campaignName = `Chien dich E2E ${suffix}`;
    const sepayApiKey = `e2e-sepay-key-${suffix}`;
    const subdomain = `e2e-loop-${suffix}`;
    const leadName = "Nguyễn Thị Lan";
    // `apps/landing-runtime/src/phone.ts` `normalizeVnPhone` rewrites `0xxxxxxxxx` to
    // `+84xxxxxxxxx` before the lead ever reaches the API — search/lookup below has to use
    // that normalized shape too.
    const leadPhone = "0912345678";
    const leadPhoneNormalized = "+84912345678";

    await test.step("create a paid product", async () => {
      await page.goto("/products");
      await page.getByRole("button", { name: /Thêm sản phẩm/i }).click();
      await page.fill("#product-name", productName);
      await page.fill("#product-price", "199000");
      await page.getByRole("button", { name: /Lưu/i }).click();
      await expect(page.getByText(productName).first()).toBeVisible();
    });

    let campaignId = "";
    await test.step("create a campaign with SePay payment enabled, attach the product", async () => {
      await page.goto("/campaigns");
      await page.getByRole("button", { name: /Thêm chiến dịch/i }).click();
      await page.fill("#campaign-name", campaignName);
      await page
        .locator("label", { hasText: productName })
        .getByRole("checkbox")
        .click();
      await page.getByRole("switch").click();
      await page.fill("#campaign-bank-bin", "970422");
      await page.fill("#campaign-account-number", "0123456789");
      await page.fill("#campaign-account-name", "DONVE E2E TEST");
      await page.fill("#campaign-transfer-prefix", "E2E");
      await page.getByRole("button", { name: /Lưu/i }).click();
      await expect(page.getByText(campaignName).first()).toBeVisible();

      const res = await page.request.get(`${API_URL}/api/campaigns`);
      const { campaigns } = await res.json();
      const campaign = campaigns.find(
        (c: { name: string }) => c.name === campaignName
      );
      expect(campaign).toBeTruthy();
      campaignId = campaign.id;
      expect(campaignId).not.toBe("");
    });

    await test.step("connect a SePay payment connection with a known API key", async () => {
      // Idempotent across re-runs: only one `sepay` connection is allowed per org
      // (`POST /api/payments/connections` 409s on a second one) — drop any leftover from a
      // previous run of this test so the freshly-generated `sepayApiKey` is the one actually
      // stored (and the webhook step below resolves against the connection this run made).
      const existing = await page.request.get(
        `${API_URL}/api/payments/connections`
      );
      const { connections } = await existing.json();
      for (const conn of connections) {
        // eslint-disable-next-line no-await-in-loop -- sequential cleanup, at most 1 row expected
        await page.request.delete(
          `${API_URL}/api/payments/connections/${conn.id}`
        );
      }

      await page.goto("/payment-connections");
      await page.getByRole("button", { name: "Kết nối SePay" }).click();
      await page.fill("#payment-bank-bin", "970422");
      await page.fill("#payment-account-number", "0123456789");
      await page.fill("#payment-account-name", "DONVE E2E TEST");
      await page.fill("#payment-api-key", sepayApiKey);
      await page.getByRole("button", { name: "Lưu kết nối" }).click();
      await expect(page.getByText("970422").first()).toBeVisible();
    });

    let landingId = "";
    await test.step("custom-import a fixture whose form fields carry `name` attributes, then wire it", async () => {
      const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
        <title>Khoa hoc E2E</title></head><body>
        <h1>Content Video Ngan Trong 30 Ngay</h1>
        <form id="signup-form" novalidate>
          <input id="ten" name="ten" type="text" placeholder="Ho va ten" />
          <input id="sdt" name="sdt" type="tel" placeholder="So dien thoai" />
          <input id="mail" name="mail" type="email" placeholder="Email" />
          <button type="submit">Dang ky ngay</button>
        </form>
        </body></html>`;

      await page.goto("/landings");
      await page
        .getByRole("button", { name: /Nhập trang có sẵn/i })
        .first()
        .click();
      await page.fill("#custom-import-name", `Landing E2E ${suffix}`);
      await page.getByRole("tab", { name: "Dán đường dẫn" }).click(); // no-op, resets mode state
      await page.getByRole("tab", { name: "Dán mã trang" }).click();
      await page.locator("textarea").fill(html);
      await page.getByRole("button", { name: /^Nhập trang$/ }).click();
      await page.waitForURL("**/landings/*/custom-import");
      landingId =
        page.url().match(/landings\/([^/]+)\/custom-import/)?.[1] ?? "";
      expect(landingId).not.toBe("");

      const preview = page.frameLocator('iframe[title="Xem trước"]');
      await expect(
        preview.getByText("Content Video Ngan Trong 30 Ngay")
      ).toBeVisible();

      // Map the 3 canonical fields — this is the flow test 1's real-world fixture can't reach.
      const selects = page.locator('button[role="combobox"]');
      const mapField = async (index: number, value: string) => {
        await selects.nth(index).click();
        await page.getByRole("option", { name: value, exact: true }).click();
      };
      await mapField(0, "ten"); // Họ tên
      await mapField(1, "sdt"); // Số điện thoại
      await mapField(2, "mail"); // Email
      await page
        .getByRole("button", { name: "Kết nối biểu mẫu khách hàng" })
        .click();
      await expect(page.getByText("Đã kết nối").first()).toBeVisible();
    });

    await test.step("publish, attaching the campaign so the lead form has somewhere to submit into", async () => {
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      // needsCampaign warning — attach the campaign we created above via its own combobox.
      await page.getByPlaceholder("Tìm đợt bán…").click();
      await page.getByRole("option", { name: campaignName }).click();
      await page.getByRole("button", { name: "Gắn vào" }).click();
      await expect(page.getByText("Đã gắn đợt bán").first()).toBeVisible({
        timeout: 10_000
      });

      await page.fill("#publish-subdomain", subdomain);
      await page.getByRole("button", { name: "Xuất bản", exact: true }).click();
      await expect(
        page.getByText(subdomain, { exact: false }).first()
      ).toBeVisible({
        timeout: 15_000
      });
    });

    let previewUrl = "";
    await test.step("verify via the API that a real `deployments` row + live hostname exists", async () => {
      const res = await page.request.get(
        `${API_URL}/api/landings/${landingId}/deployments`
      );
      expect(res.ok()).toBe(true);
      const { deployments } = await res.json();
      const live = deployments.find(
        (d: { status: string }) => d.status === "live"
      );
      expect(live).toBeTruthy();
      expect(live.hostname).toBe(`${subdomain}.donve.local.test`);

      // Real HTTP round-trip substitute for the (infeasible-here) edge-router hostname route —
      // same build_deploy artifact, served back by the api's own `/public/preview/:token/*`.
      const previewRes = await page.request.post(
        `${API_URL}/api/landings/${landingId}/preview`,
        { data: "{}" }
      );
      expect(previewRes.ok()).toBe(true);
      previewUrl = (await previewRes.json()).url;
      expect(previewUrl).toContain("/public/preview/");
    });

    await test.step("a real site visitor fills in and submits the lead form", async () => {
      const visitor = await context.newPage();
      await visitor.goto(previewUrl);
      await expect(
        visitor.getByText("Content Video Ngan Trong 30 Ngay")
      ).toBeVisible();

      await visitor.fill('input[name="fullName"]', leadName);
      await visitor.fill('input[name="phone"]', leadPhone);
      await visitor.fill('input[name="email"]', "lan.nguyen.e2e@example.com");
      await visitor.locator('input[name="consent"]').check();

      const leadResponse = visitor.waitForResponse(
        (r) => r.url().includes("/public/leads"),
        { timeout: 20_000 }
      );
      await visitor.getByRole("button", { name: "Dang ky ngay" }).click();
      const res = await leadResponse;
      const resBody = await res.json();
      expect(res.status(), JSON.stringify(resBody)).toBe(201);
      expect(resBody.order?.orderCode).toContain("E2E");
      await visitor.close();
    });

    let orderCode = "";
    await test.step("the lead lands in the inbox", async () => {
      await page.goto(
        `/inbox?search=${encodeURIComponent(leadPhoneNormalized)}`
      );
      await expect(page.getByText(leadName).first()).toBeVisible({
        timeout: 15_000
      });

      const res = await page.request.get(
        `${API_URL}/api/leads?search=${encodeURIComponent(leadPhoneNormalized)}`
      );
      const body = await res.json();
      const lead = body.leads.find(
        (l: { phone: string }) => l.phone === leadPhoneNormalized
      );
      expect(lead).toBeTruthy();

      const ordersRes = await page.request.get(`${API_URL}/api/leads/orders`);
      const { orders } = await ordersRes.json();
      const order = orders.find(
        (o: { leadPhone: string }) => o.leadPhone === leadPhoneNormalized
      );
      expect(order).toBeTruthy();
      orderCode = order.code;
      expect(orderCode.startsWith("E2E")).toBe(true);
    });

    await test.step("a synthetic SePay webhook pays the order (API-level, matching a real delivery)", async () => {
      const res = await page.request.post(`${API_URL}/webhooks/sepay`, {
        headers: { authorization: `Apikey ${sepayApiKey}` },
        data: {
          id: `tx-e2e-${suffix}`,
          transferAmount: 199_000,
          content: `CT tu 0123456 ${orderCode} chuyen khoan`,
          transactionDate: "2026-08-20T10:00:00Z"
        }
      });
      expect(res.status()).toBe(200);
      expect(await res.json()).toMatchObject({ ok: true });
    });

    await test.step("order desk shows it paid, and fulfillment can be marked complete", async () => {
      await page.goto("/reconciliation");
      // Scoped to `OrderDeskRow`'s own root className (`reconciliation-page.tsx`) — a bare
      // `div` + `hasText` match would pick an ancestor wrapping every row instead of just this one.
      const row = page.locator("div.rounded-lg.border.p-4", {
        hasText: orderCode
      });
      await expect(row.getByText("Chưa giao").first()).toBeVisible({
        timeout: 15_000
      });

      await row.getByRole("button", { name: "Xác nhận đã giao" }).click();
      await expect(row.getByText("Đã giao").first()).toBeVisible({
        timeout: 15_000
      });
    });
  });
});
