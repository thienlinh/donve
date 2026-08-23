/**
 * Zalo Mini App → Donve bridge — reference Cloudflare Worker.
 *
 * KHÔNG phải code trong monorepo Donve — đây là file MẪU để doanh nghiệp (hoặc đơn vị code
 * Mini App của họ) deploy RIÊNG, đứng giữa Mini App client và Donve. Xem
 * docs/features/leads/integrations.md §B.3 để hiểu vì sao cầu nối này cần tồn tại (Zalo Mini App
 * trả về 1 token đã mã hoá cho `getPhoneNumber()`, không phải SĐT thật — phải giải mã phía
 * server bằng App Secret của Mini App, một secret không bao giờ được đưa vào code client).
 *
 * Luồng:
 *   Mini App (client, chạy trong Zalo)
 *     → getAccessToken() + getPhoneNumber() → nhận `token`
 *     → POST tới Worker này: { token, fullName? }
 *   Worker này:
 *     1. Gọi API giải mã của Zalo bằng ZALO_MINIAPP_SECRET_KEY → lấy SĐT thật
 *        ⚠️ ĐÂY LÀ CHỖ CHƯA XÁC NHẬN ĐƯỢC — xem hàm decodeZaloPhoneToken() bên dưới.
 *     2. Forward sang Donve: POST /webhooks/generic-leads (Bearer DONVE_GENERIC_API_KEY)
 *
 * Setup (làm 1 lần):
 *   1. `wrangler secret put ZALO_MINIAPP_SECRET_KEY`   — App Secret của Zalo Mini App (khác OA Secret Key)
 *   2. `wrangler secret put DONVE_GENERIC_API_KEY`     — tạo tại Donve → Cài đặt → Webhook nhận lead → "API tuỳ chỉnh"
 *   3. Set DONVE_ORG_ID / DONVE_CAMPAIGN_ID trong wrangler.toml `[vars]` (không phải secret, không nhạy cảm)
 *   4. `wrangler deploy` → dán URL Worker vào Mini App làm endpoint nhận token
 */

export interface Env {
  ZALO_MINIAPP_SECRET_KEY: string;
  DONVE_GENERIC_API_KEY: string;
  DONVE_ORG_ID: string;
  DONVE_CAMPAIGN_ID: string;
  DONVE_API_BASE: string; // vd: "https://api.donve.vn"
}

interface MiniAppRequestBody {
  token: string;
  fullName?: string;
}

/**
 * ⚠️ CHƯA XÁC NHẬN ĐƯỢC endpoint/tham số chính xác từ tài liệu chính thức Zalo (trang docs là
 * SPA JS, không tra cứu được qua công cụ hiện có khi viết file này — xem
 * lead-integrations.md §B.3 để biết đã thử những gì). Trước khi dùng thật, XÁC NHẬN LẠI với
 * https://miniapp.zaloplatforms.com/docs/api/getPhoneNumber/ — khả năng cao endpoint/tên field
 * đã đổi khác so với giả định dưới đây. Coi hàm này là khung sườn cần điền, không phải spec.
 */
async function decodeZaloPhoneToken(
  token: string,
  secretKey: string
): Promise<string> {
  // GIẢ ĐỊNH CHƯA XÁC NHẬN — thay bằng endpoint/tham số thật theo tài liệu Zalo lúc triển khai.
  const res = await fetch("https://graph.zalo.me/v2.0/me/info", {
    method: "GET",
    headers: {
      access_token: token,
      code: token,
      secret_key: secretKey
    }
  });
  if (!res.ok) {
    throw new Error(`Zalo decode failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as { data?: { number?: string } };
  const phone = data.data?.number;
  if (!phone) throw new Error("Zalo decode response missing phone number");
  return phone;
}

async function forwardToDonve(
  env: Env,
  fullName: string,
  phone: string
): Promise<Response> {
  const url = `${env.DONVE_API_BASE}/webhooks/generic-leads?orgId=${env.DONVE_ORG_ID}&campaignId=${env.DONVE_CAMPAIGN_ID}`;
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.DONVE_GENERIC_API_KEY}`
    },
    body: JSON.stringify({ fullName, phone })
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    let body: MiniAppRequestBody;
    try {
      body = (await request.json()) as MiniAppRequestBody;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }
    if (!body.token) {
      return new Response("Missing token", { status: 400 });
    }

    try {
      const phone = await decodeZaloPhoneToken(
        body.token,
        env.ZALO_MINIAPP_SECRET_KEY
      );
      const donveRes = await forwardToDonve(
        env,
        body.fullName || "Zalo Mini App user",
        phone
      );
      if (!donveRes.ok) {
        return new Response(await donveRes.text(), { status: donveRes.status });
      }
      return new Response(await donveRes.text(), { status: 200 });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: err instanceof Error ? err.message : String(err)
        }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }
  }
};
