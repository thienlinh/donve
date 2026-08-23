# Lead Integrations — Hướng dẫn đầy đủ (Facebook, Zalo, Google Ads, Landing Page, và các nền tảng khác)

Tài liệu này viết theo hành trình thật của **1 doanh nghiệp dùng Donve**, không phải theo cấu trúc code. Nếu bạn là dev muốn xem field/route/behavior chi tiết, xem [Phụ lục kỹ thuật](#phụ-lục-kỹ-thuật) ở cuối — mọi thứ trong phụ lục đọc trực tiếp từ `apps/api/src/modules/leads/webhooks.ts`/`routing.ts` đang chạy, không phải lý thuyết.

**Nguyên tắc nền tảng cần nhớ trước khi đọc tiếp (BYOK)**: Donve không tự có tài khoản Facebook/Zalo/Google nào. Mỗi tính năng dưới đây đều là **doanh nghiệp tự đăng ký tài khoản của họ trên nền tảng đó, tự lấy secret/token, tự dán vào Cài đặt của Donve**. Donve chỉ là nơi nhận và xử lý.

---

## A. Facebook Ads — full luồng từ quảng cáo tới Donve

### A.1 Sơ đồ tổng quan

```
┌─ Doanh nghiệp chạy quảng cáo trên Facebook/Instagram ─────────────┐
│  Tạo chiến dịch "Lead Ads" trên Facebook Ads Manager               │
│  Người dùng thấy quảng cáo → bấm → điền form ngay trong Facebook   │
└──────────────────────────┬─────────────────────────────────────────┘
                            │ Facebook lưu lead, KHÔNG gửi dữ liệu form
                            ▼
        Facebook gửi 1 THÔNG BÁO tới webhook Donve:
        POST /webhooks/facebook-leads?orgId=..&campaignId=..
        Body: { entry: [{ changes: [{ value: { leadgen_id: "123..." } }] }] }
                            │
                            ├─ Donve verify chữ ký (an toàn: chỉ App thật của bạn gọi được)
                            ├─ Donve gọi NGƯỢC LẠI Facebook (Graph API) bằng Page Access Token
                            │   GET graph.facebook.com/{leadgen_id}?access_token=...
                            │   → Facebook trả về: tên, SĐT, email thật của người vừa điền form
                            ├─ findOrCreateLead() — dedupe theo SĐT
                            ├─ Lead mới → tự động gán người phụ trách (routing engine)
                            └─ Bắn realtime lên Dashboard (chuông thông báo)
```

**Điều quan trọng nhất cần hiểu**: webhook Facebook gửi tới Donve **không chứa tên/SĐT** — nó chỉ báo "có 1 lead mới, id là X". Donve phải **chủ động gọi lại** Facebook bằng 1 "chìa khoá" riêng (Page Access Token) để lấy dữ liệu thật. Đây là quy định bắt buộc của Facebook (chống lộ dữ liệu qua webhook không xác thực), không phải giới hạn của Donve.

### A.2 Doanh nghiệp cần làm gì (từng bước)

1. **Tạo Facebook App**: vào [Meta for Developers](https://developers.facebook.com/apps) → Tạo App loại **Business** → gắn App vào Business Manager của doanh nghiệp.
2. **Thêm sản phẩm "Webhooks"**: chọn object `Page`, subscribe field `leadgen`.
3. **Xin quyền `leads_retrieval`**: đây là quyền cho phép App gọi Graph API lấy dữ liệu lead. Với App chưa qua **App Review** của Meta, quyền này chỉ hoạt động với Page mà chính tài khoản Developer đang là Admin (đủ để test); muốn dùng cho khách hàng thật (Page không phải của bạn), Meta **bắt buộc App Review** — quy trình này của Meta, không phải của Donve, có thể mất vài ngày.
4. **Kết nối Facebook Page vào App**: qua Business Manager, cấp quyền Page cho App (OAuth).
5. **Lấy Page Access Token dài hạn (không hết hạn)** — đã tra cứu đủ 2 bước từ tài liệu chính thức Meta ([Long-Lived Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/)), không còn phần bỏ lửng:
   - **Bước 5a — lấy User Access Token ngắn hạn**: vào [Graph API Explorer](https://developers.facebook.com/tools/explorer/) → chọn App → chọn quyền `leads_retrieval`, `pages_read_engagement`, `pages_show_list` → **Generate Access Token**. Token này (của user, không phải của Page) chỉ sống ~1-2h — bình thường, chưa dùng được, còn 2 bước đổi nữa.
   - **Bước 5b — đổi sang User Access Token dài hạn (~60 ngày)**: gọi 1 lần (dán vào trình duyệt hoặc `curl`):
     ```
     GET https://graph.facebook.com/v21.0/oauth/access_token
       ?grant_type=fb_exchange_token
       &client_id=<App ID>
       &client_secret=<App Secret>
       &fb_exchange_token=<token ngắn hạn từ bước 5a>
     ```
     Response trả về `access_token` mới — đây là User Access Token dài hạn.
   - **Bước 5c — đổi sang Page Access Token (token này mới thật sự KHÔNG hết hạn)**: gọi tiếp, dùng token dài hạn vừa có ở 5b:
     ```
     GET https://graph.facebook.com/v21.0/me/accounts?access_token=<token dài hạn từ bước 5b>
     ```
     Response trả về danh sách Page bạn quản lý, mỗi Page kèm 1 `access_token` riêng — **đây chính là Page Access Token cần dán vào Donve**, theo Meta "không có ngày hết hạn" (chỉ mất hiệu lực nếu bạn đổi mật khẩu, gỡ quyền App, hoặc chủ động thu hồi — không tự hết hạn theo thời gian).
6. **Lấy App Secret**: Facebook App → Settings → Basic.
7. **Vào Donve → Cài đặt → Webhook nhận lead** (`/leads/webhook-settings`):
   - Copy **URL webhook** đã điền sẵn `orgId`, tự thêm `&campaignId=<id>` (lấy từ trang Chiến dịch — mỗi chiến dịch có 1 URL riêng vì lead cần biết đổ vào chiến dịch nào).
   - Dán **App Secret** vào ô Secret.
   - Dán **Page Access Token** vào ô riêng (bắt buộc — không có thì webhook nhận được thông báo nhưng không lấy được tên/SĐT, trả lỗi `409 facebook_page_access_token_not_configured`).
8. **Dán URL webhook đó vào Facebook App** (bước 2) → Facebook sẽ gọi `GET` để xác minh bạn sở hữu URL (Donve đã hỗ trợ sẵn bước xác minh này — điền thêm **Verify Token** tuỳ ý ở cả 2 nơi, khớp nhau là qua).
9. Xong — từ giờ ai điền form quảng cáo, lead sẽ tự xuất hiện trong Donve.

### A.3 Cá nhân chạy quảng cáo thì sao? — Có, hỗ trợ đầy đủ, không cần công ty

Toàn bộ 9 bước ở trên áp dụng **y hệt** cho 1 cá nhân tự chạy quảng cáo (freelancer, chủ shop nhỏ, KOL...), không chỉ doanh nghiệp có pháp nhân. Đã tra cứu lại để xác nhận rõ, vì đây là điểm dễ hiểu nhầm:

- Bước 1 ("Tạo Facebook App") yêu cầu App phải gắn vào 1 **Meta Business Portfolio** (tên mới của "Business Manager") — nhưng tạo Business Portfolio **hoàn toàn miễn phí và không yêu cầu giấy phép kinh doanh, mã số thuế, hay pháp nhân nào cả**. Chỉ cần 1 tài khoản Facebook cá nhân + điền tên (có thể là tên cá nhân/thương hiệu riêng, không cần là tên công ty đăng ký) + email. Một cá nhân hoàn toàn tự tạo Business Portfolio cho chính mình trong vài phút.
- Bước 3 ("App Review") chỉ thật sự bắt buộc khi App cần lấy lead từ 1 Facebook Page **mà bạn không phải Admin** (vd: agency chạy quảng cáo hộ khách hàng khác). Nếu bạn tự sở hữu cả Page lẫn App (trường hợp phổ biến của cá nhân/SME tự chạy quảng cáo cho chính mình), **không cần đợi App Review** — quyền `leads_retrieval` đã hoạt động ngay ở mức Standard Access vì App tự quản lý Page của chính chủ App.

Nói ngắn gọn: nếu bạn tự chạy quảng cáo cho chính Page của mình, toàn bộ setup xong trong 1 buổi, không cần chờ Meta duyệt gì cả. App Review chỉ phát sinh khi có bên thứ 3 (agency, đối tác) đứng giữa.

### A.4 Instagram thì sao?

**Không cần làm gì thêm.** Instagram Lead Ads dùng chung hạ tầng "Page object" webhook với Facebook (Meta hợp nhất quảng cáo Facebook + Instagram từ lâu) — cùng 1 App, cùng 1 webhook URL, cùng field mapping. Chạy quảng cáo Lead Ads trên Instagram, lead vẫn đổ về đúng chỗ.

### A.5 Field mapping (khi Graph API trả dữ liệu về)

| Facebook `field_data.name` | Map vào | Ghi chú |
| --- | --- | --- |
| `full_name`, `name` | `fullName` |  |
| `phone_number`, `phone` | `phone` | chuẩn hoá theo định dạng VN |
| `email` | `email` | tuỳ chọn |
| Câu hỏi tuỳ chỉnh khác (`city`, `company`...) | lưu vào Trường tùy chỉnh của lead |  |

### A.6 Test thử mà không cần chờ Facebook thật

```bash
# Test nhanh với dữ liệu tự tạo (không gọi Facebook thật) — dùng khi chưa có Page Access Token
SECRET="App Secret bạn đã dán ở Cài đặt"
BODY='{"field_data":[{"name":"full_name","values":["Nguyen Van A"]},{"name":"phone_number","values":["0912345678"]}]}'
SIG="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')"
curl -X POST "https://api.<domain>/webhooks/facebook-leads?orgId=<orgId>&campaignId=<campaignId>" \
  -H "Content-Type: application/json" -H "x-hub-signature-256: $SIG" -d "$BODY"
```

Cách trên gửi thẳng `field_data` (bỏ qua bước gọi Graph API) — dùng để test luồng dedupe/routing/realtime mà chưa cần Page Access Token thật. Khi test với **webhook thật của Facebook** (`leadgen_id`), Donve sẽ tự gọi Graph API — nếu Page Access Token sai/hết hạn, trả `502 facebook_graph_api_failed`.

---

## B. Zalo — 2 cách, khác nhau hoàn toàn

### B.1 Sự thật cần biết trước

Zalo OA (Official Account — trang chat như Fanpage) **không bao giờ chia sẻ số điện thoại người dùng** cho doanh nghiệp qua webhook hay API thông thường, kể cả người dùng đã nhắn tin. Đây là giới hạn quyền riêng tư của nền tảng Zalo, áp dụng cho mọi App, không riêng Donve. Muốn có SĐT thật từ Zalo, **bắt buộc** phải qua Zalo Mini App với sự đồng ý rõ ràng của người dùng.

### B.2 Cách 1 — Webhook Zalo OA (đã có sẵn, nhưng chỉ best-effort)

Dùng khi: doanh nghiệp đã có sẵn OA để chăm sóc khách, muốn khách nhắn "cho tôi tư vấn, SĐT 0912xxx" và tự động tạo thành lead.

```
Khách nhắn tin cho OA
        ▼
Zalo gửi webhook: {app_id, sender:{id}, message:{text}, timestamp}
        ▼
Donve đọc nội dung tin nhắn — nếu CÓ số điện thoại VN hợp lệ trong đó → tạo lead
                              — nếu KHÔNG (chào hỏi, hỏi giá, sticker...) → bỏ qua, không lỗi
```

Setup: vào [Zalo OA Developer](https://developers.zalo.me/) → tạo App loại OA → lấy **OA Secret Key** → cấu hình Webhook URL trỏ về Donve (`/webhooks/zalo-oa?orgId=..&campaignId=..`) → dán secret vào Donve Cài đặt → Webhook nhận lead.

Hạn chế: chỉ bắt được lead khi khách **chủ động gõ SĐT trong tin nhắn** — không có form, không ép buộc được, tỉ lệ bắt được thấp hơn nhiều so với 1 form thật.

### B.3 Cách 2 — Zalo Mini App (khuyến nghị nếu cần SĐT đáng tin cậy) — đã có sẵn cầu nối mẫu

Đây là hướng đúng nếu mục tiêu là "form thu thập lead" giống landing page, nhưng chạy trong app Zalo. Khác với bản trước của tài liệu này (chỉ mô tả lý thuyết), giờ đã có **endpoint riêng cho việc này** (`/webhooks/generic-leads`, xem §B.3.4) và **1 file Worker mẫu sẵn sàng deploy** (§B.3.5) — không phải tự nghĩ từ đầu nữa.

```
┌─ Doanh nghiệp xây 1 Mini App (hoặc thuê đơn vị làm) ──────────────┐
│  Mini App có 1 nút "Nhận ưu đãi" / "Đăng ký tư vấn"                │
└──────────────────────────┬──────────────────────────────────────────┘
                            ▼
        Người dùng bấm nút → Mini App gọi zmp-sdk:
        1. getAccessToken()  → lấy access token của người dùng trong phiên Mini App
        2. getPhoneNumber()  → Zalo hiện popup xin phép chia sẻ SĐT
                                người dùng đồng ý → trả về 1 TOKEN đã mã hoá (KHÔNG phải SĐT thật)
                            ▼
        Mini App gửi token đó lên Worker cầu nối (§B.3.5 — của doanh nghiệp, không phải Donve)
                            ▼
        Worker gọi API giải mã của Zalo (dùng App Secret của Mini App) → nhận SĐT thật
                            ▼
        Worker gọi POST /webhooks/generic-leads của Donve (Bearer API Key, §B.3.4)
        → Lead xuất hiện trong Donve
```

#### B.3.1 Vì sao KHÔNG dùng `POST /public/leads` cho bước cuối

Bản trước của tài liệu này khuyên dùng `/public/leads` — **sai, đã tự phát hiện và sửa**. `/public/leads` bắt buộc `turnstileToken` (Cloudflare Turnstile — chỉ 1 widget chạy thật trong trình duyệt mới giải được). Worker cầu nối là code chạy server-to-server, không phải trình duyệt, nên **không thể** tạo ra Turnstile token hợp lệ — gọi `/public/leads` từ server sẽ luôn bị từ chối. Đây là lý do `/webhooks/generic-leads` (§B.3.4) được xây riêng: xác thực bằng API Key tĩnh thay vì Turnstile, đúng cho mọi trường hợp gọi từ server/no-code tool.

#### B.3.2 Việc cần làm phía doanh nghiệp

1. Đăng ký Mini App tại [Zalo Mini App Developer](https://miniapp.zaloplatforms.com/) (khác App loại OA ở mục B.2 — đây là loại App riêng).
2. Xin cấp quyền `getPhoneNumber` cho Mini App — theo cộng đồng Zalo, quyền này cần được Zalo duyệt cho App production (không tự động có ngay khi tạo App).
3. Build giao diện Mini App (HTML/JS chạy trong Zalo, dùng bộ SDK `zmp-sdk`) — đây là 1 "mini web app" riêng, cần code, không có sẵn trong Donve (mỗi Mini App là 1 sản phẩm UX riêng của từng doanh nghiệp, Donve không thể tự động hoá phần này).
4. Deploy Worker cầu nối — dùng file mẫu có sẵn, xem §B.3.5, không phải viết từ đầu.

#### B.3.3 ⚠️ Phần chưa xác nhận được — cần bạn tự kiểm tra khi có tài khoản thật

Bước "gọi API giải mã token → SĐT thật" của Zalo: đã tra cứu nhiều hướng (community docs, GitHub SDK, blog kỹ thuật) và xác nhận được **khái niệm** đúng (cần App Secret của Mini App, gọi 1 endpoint server-side, nhận về SĐT) nhưng **không tìm được URL/tham số chính xác** — trang tài liệu chính thức [miniapp.zaloplatforms.com/docs/api/getPhoneNumber](https://miniapp.zaloplatforms.com/docs/api/getPhoneNumber/) là SPA JS, công cụ tra cứu hiện có không đọc được nội dung render bằng JS. File Worker mẫu ở §B.3.5 đánh dấu rõ chỗ này bằng comment `⚠️ CHƯA XÁC NHẬN ĐƯỢC` — khi có tài khoản Zalo Mini App thật, đây là **việc đầu tiên cần làm** trước khi dùng thật: mở tài liệu đó (lúc này bạn đăng nhập được, không còn là SPA chặn crawler) và sửa đúng endpoint/tham số.

#### B.3.4 Endpoint cầu nối phía Donve — `/webhooks/generic-leads`

Không cần tạo Facebook/Zalo App nào để dùng endpoint này — nó xác thực bằng 1 API Key do **Donve tự sinh**, không phải secret của bên thứ 3:

1. Vào **Donve → Cài đặt → Webhook nhận lead → thẻ "API tuỳ chỉnh"** → bấm **Tạo API Key**.
2. Copy key hiện ra (chỉ hiện **đúng 1 lần**, không xem lại được — mất thì tạo lại, key cũ tự huỷ).
3. Copy URL webhook đã điền sẵn `orgId`, tự thêm `&campaignId=<id>`.
4. Dán API Key vào Worker cầu nối dưới dạng header `Authorization: Bearer <key>`.

```bash
# Test thủ công endpoint này (không cần chữ ký phức tạp, chỉ cần đúng key)
curl -X POST "https://api.<domain>/webhooks/generic-leads?orgId=<orgId>&campaignId=<campaignId>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <api-key-vừa-tạo>" \
  -d '{"fullName":"Nguyen Van A","phone":"0912345678"}'
```

Sai/thiếu key → `401 invalid_webhook_signature`. Đúng key, sai campaignId → `404 campaign_not_found`. Đúng hết → `{"ok":true,"leadId":"...","status":"created"}` — đã tự test end-to-end với key thật, chạy đúng.

#### B.3.5 File Worker mẫu — deploy trong ~15 phút

[`docs/features/leads/examples/zalo-miniapp-bridge-worker.ts`](examples/zalo-miniapp-bridge-worker.ts) — 1 Cloudflare Worker hoàn chỉnh, đã điền sẵn phần gọi `/webhooks/generic-leads` (đúng, đã test), chỉ còn 1 hàm `decodeZaloPhoneToken()` cần bạn điền đúng endpoint Zalo thật (xem §B.3.3). Không cần cài Donve SDK gì — chỉ cần `wrangler deploy` với 4 biến môi trường (2 secret, 2 biến thường), hướng dẫn đầy đủ ngay trong file.

---

## C. Landing Page + Custom Domain — full luồng và câu hỏi "whitelist"

### C.1 Sơ đồ tổng quan

```
┌─ Bạn tạo landing page trong Donve Studio, bấm Publish ────────────┐
│  Landing page được build thành 1 file HTML tĩnh + script nhỏ      │
│  (apps/landing-runtime) nhúng sẵn: orgId, campaignId, apiUrl       │
└──────────────────────────┬──────────────────────────────────────────┘
                            ▼
        Chọn domain phục vụ:
        (a) subdomain có sẵn: <ten>.donve.vn (mặc định, không cần làm gì)
        (b) custom domain: cuahangcuaban.com (cần thêm bước bên dưới)
                            ▼
┌─ Khách truy cập landing page, điền form ───────────────────────────┐
│  Trình duyệt khách chạy script → fetch() POST tới                  │
│  https://api.donve.vn/public/leads  (domain KHÁC với landing page!)│
└──────────────────────────┬──────────────────────────────────────────┘
                            ▼
        Donve verify Turnstile (chống bot) → tạo lead → routing → realtime
```

**Điểm mấu chốt bạn đang hỏi ("whitelist")**: request từ trình duyệt khách (đang đứng trên `cuahangcuaban.com` hoặc `abc.donve.vn`) gọi sang `api.donve.vn` là 1 request **khác domain (cross-origin)** — trình duyệt có cơ chế bảo vệ gọi là CORS, chặn mọi request khác-domain trừ khi server cho phép rõ ràng.

### C.2 Phát hiện & đã sửa: đây từng là 1 lỗi thật

Trong lúc kiểm tra để trả lời câu hỏi của bạn, tôi phát hiện `/public/leads` **chưa từng được cấu hình CORS** — nghĩa là **trước bản sửa này, mọi landing page đã publish (cả subdomain lẫn custom domain) đều không gửi được lead**, trình duyệt chặn ngay từ bước đầu. Đã tự kiểm tra bằng cách giả lập đúng request cross-origin thật:

```
Trước khi sửa: "Access to fetch at 'http://localhost:3000/public/leads' from origin
'http://localhost:5173' has been blocked by CORS policy: ... No 'Access-Control-Allow-Origin'
header is present" → request thất bại hoàn toàn.

Sau khi sửa (apps/api/src/app.ts): request qua được, nhận phản hồi bình thường.
```

### C.3 "Whitelist" hoạt động như thế nào — câu trả lời thật

**Không có whitelist domain cụ thể, và không cần có.** `/public/leads` cho phép **mọi origin** gọi tới (`Access-Control-Allow-Origin: *`). Nghe có vẻ kém an toàn, nhưng đây là lựa chọn đúng và an toàn cho đúng loại endpoint này, vì:

1. **Domain khách hàng là động, không thể liệt kê trước.** Mỗi khách dùng Donve có thể tự thêm custom domain bất cứ lúc nào (qua trang "Tên miền") — không thể duy trì 1 danh sách domain cố định để "whitelist", vì danh sách đó thay đổi liên tục theo từng khách hàng của Donve.
2. **Endpoint này không dùng session/cookie** — không có gì bí mật bị lộ nếu domain lạ gọi vào. Ai gọi cũng phải tự cung cấp `orgId`+`campaignId` hợp lệ và vượt qua Turnstile.
3. **Bảo mật thật nằm ở 3 lớp khác**, không phải ở domain:
   - **Turnstile** (Cloudflare, chống bot) — request không có token hợp lệ bị từ chối ngay.
   - **`orgId`/`campaignId` phải tồn tại thật** — request với id bịa đặt bị `404`.
   - **Rate limit theo IP** (30 request/phút cho `/public/leads`) — chặn spam.

Nói cách khác: câu hỏi đúng không phải "domain nào được whitelist" mà là "ai được tạo lead" — câu trả lời là "bất kỳ ai vượt qua được Turnstile + biết đúng orgId/campaignId", không phụ thuộc domain họ đứng ở đâu. Đây cũng chính là lý do custom domain **không cần cấu hình gì thêm** để lead hoạt động — không có bước "khai báo domain này được phép gửi lead" nào cả.

### C.4 orgId tới từ đâu khi dùng custom domain?

Không lấy từ domain lúc chạy (không tin cậy, dễ giả mạo qua header `Origin`). `orgId` được **nhúng sẵn tĩnh** vào file landing page ngay lúc Publish (`apps/landing-runtime`), không phụ thuộc domain nào sẽ phục vụ nó sau này. Vì vậy dù bạn đổi custom domain, gỡ domain, hay landing page được truy cập qua domain nào đi nữa, `orgId` gửi kèm vẫn luôn đúng.

### C.5 Custom domain — đã có sẵn, không phải tự làm

Trang "Tên miền" trong Donve (`apps/api/src/modules/domains/routes.ts` + `apps/api/src/lib/cloudflare-saas.ts`) đã làm sẵn toàn bộ: nhập domain → Donve tạo Custom Hostname qua Cloudflare for SaaS → hiển thị bản ghi DNS (CNAME) bạn cần thêm ở nhà cung cấp domain của bạn → Donve tự poll trạng thái xác minh/SSL → khi `active`, landing page phục vụ được ngay trên domain đó, lead hoạt động ngay lập tức (không có bước riêng nào cho lead cả, dùng chung cơ chế C.1-C.4 ở trên).

---

## D. Nền tảng khác (TikTok, Instagram, YouTube...) — có cần thêm webhook riêng không?

**Câu trả lời ngắn: tuỳ nền tảng, không có công thức chung.** Mỗi nền tảng quảng cáo lớn tự thiết kế hệ thống lead-gen riêng, không tương thích nhau:

| Nền tảng | Có route riêng trong Donve? | Ghi chú |
| --- | --- | --- |
| **Instagram** | Có, dùng chung Facebook | Dùng chung hạ tầng Facebook (mục A.3) — Meta hợp nhất từ lâu, không cần làm gì thêm. |
| **YouTube / Google Ads** | **Có, đã build** | YouTube tự nó không có "Lead Ads" — hình thức tương đương là **Google Ads Lead Form Extensions**. Route riêng `/webhooks/google-ads-leads` — xem §E. |
| **TikTok** | **Có, đã build** | TikTok Lead Generation — xem §F. |
| **Nền tảng khác** (web form riêng, CRM khác, chatbot, hệ thống nội bộ...) | Không cần route riêng, dùng `/webhooks/generic-leads` | Bất kỳ hệ thống nào tự POST được HTTP + dán 1 header đều dùng ngay được (§B.3.4) — không cần Donve viết thêm gì cho từng nền tảng mới. |

---

## E. Google Ads (Lead Form Extensions) — full luồng, đã build

### E.1 Sơ đồ tổng quan

```
┌─ Doanh nghiệp chạy quảng cáo Search/YouTube với "Lead Form asset" ─┐
│  Người dùng thấy quảng cáo → bấm → điền form ngay trong Google      │
└──────────────────────────┬────────────────────────────────────────┘
                            │ Google gửi TOÀN BỘ dữ liệu lead ngay trong 1 lần gọi
                            │ (khác Facebook — không cần gọi ngược lại lấy thêm dữ liệu)
                            ▼
        POST /webhooks/google-ads-leads?orgId=..&campaignId=..
        Body: { lead_id, google_key, user_column_data: [{column_id:"FULL_NAME",...}, ...] }
                            │
                            ├─ Donve so khớp google_key (do chính Donve sinh ra) — sai thì 401
                            ├─ Map user_column_data → {fullName, phone, email, customFields}
                            ├─ findOrCreateLead() — dedupe theo SĐT
                            ├─ Lead mới → tự động gán người phụ trách (routing engine)
                            └─ Bắn realtime lên Dashboard (chuông thông báo)
```

**Khác Facebook ở điểm quan trọng nhất**: Google gửi luôn đầy đủ tên/SĐT/email trong chính webhook, không có bước "gọi ngược lại lấy dữ liệu thật" — nên không cần Page Access Token hay bất kỳ credential nào từ phía Google Ads. Chỉ cần 1 key do chính Donve sinh ra, dán vào Google Ads.

### E.2 Doanh nghiệp cần làm gì (từng bước)

1. Vào **Donve → Cài đặt → Webhook nhận lead → thẻ "Google Ads (Lead Form)"** → chọn chiến dịch ở đầu trang → bấm **Tạo API Key**.
2. Copy **key** hiện ra (chỉ hiện đúng 1 lần) và copy **URL webhook** đã điền sẵn `orgId`/`campaignId`.
3. Trong **Google Ads**: vào Lead form asset đang chạy (hoặc tạo mới) → phần **Lead delivery** → chọn **Webhook integration** → dán:
   - **Webhook URL**: URL vừa copy ở bước 2.
   - **Webhook key**: API Key vừa tạo ở bước 1.
4. Bấm **Send test data** (nút có sẵn trong Google Ads) — Google gửi 1 lead giả (`is_test: true`) tới Donve để xác nhận kết nối; Donve nhận diện và **không tạo lead thật** từ request test này, chỉ xác nhận key đúng và trả `200`.
5. Xong — từ giờ ai điền Lead Form thật, lead tự xuất hiện trong Donve theo thời gian thực, không cần polling hay công cụ trung gian nào.

### E.3 Field mapping

| Google `user_column_data[].column_id` | Map vào | Ghi chú |
| --- | --- | --- |
| `FULL_NAME` | `fullName` |  |
| `PHONE_NUMBER` | `phone` | Google trả về định dạng E.164 (`+84...`) — vẫn qua `normalizeVnPhone` như mọi nguồn khác. |
| `EMAIL` | `email` | tuỳ chọn |
| Field khác (`CITY`, `COMPANY_NAME`, câu hỏi tuỳ chỉnh...) | lưu vào Trường tùy chỉnh của lead |  |

### E.4 Test thử mà không cần chờ Google Ads thật

```bash
KEY="API Key bạn đã tạo ở Cài đặt"
curl -X POST "https://api.<domain>/webhooks/google-ads-leads?orgId=<orgId>&campaignId=<campaignId>" \
  -H "Content-Type: application/json" \
  -d "{\"lead_id\":\"test-1\",\"google_key\":\"$KEY\",\"user_column_data\":[{\"column_id\":\"FULL_NAME\",\"string_value\":\"Nguyen Van A\"},{\"column_id\":\"PHONE_NUMBER\",\"string_value\":\"+84912345678\"}]}"
```

Sai/thiếu `google_key` → `401 invalid_webhook_signature`. Đúng key, sai `campaignId` → `404 campaign_not_found`. Đúng hết → `{}` (theo đúng contract Google quy định cho response 200, khác `{"ok":true,...}` của các route khác — xem Phụ lục).

### E.5 Nguồn tham khảo đã xác nhận

Đặc tả trong mục này lấy từ tài liệu chính thức Google: [Webhook integration overview](https://developers.google.com/google-ads/webhook/docs/overview) và [Implementation guide](https://developers.google.com/google-ads/webhook/docs/implementation) — 2 trang này đọc được đầy đủ (không phải SPA chặn crawler), nên phần này **không có** cảnh báo "chưa xác nhận được" nào.

---

## F. TikTok Lead Generation — full luồng, đã build

### F.1 Vì sao khác hẳn Facebook/Zalo/Google Ads

3 mục trên đều là **BYOK thuần**: doanh nghiệp tự tạo tài khoản/App bên thứ 3, tự lấy secret, tự dán vào Donve. TikTok **không đi theo mô hình đó** — không phải Donve chọn khác, mà vì bản chất kỹ thuật của TikTok Marketing API bắt buộc:

- Xác thực webhook của TikTok ký bằng secret của **chính App developer gọi API** (`Tiktok-Signature`, xem F.4) — không có khái niệm "mỗi doanh nghiệp tự có secret riêng" như Facebook App Secret.
- Muốn nhận lead của 1 tài khoản quảng cáo, phải có `access_token` của tài khoản đó — và TikTok **chỉ cấp qua OAuth thật** (doanh nghiệp bấm đồng ý trên màn hình TikTok), không có kiểu "vào Graph API Explorer tự bấm Generate Token" như Facebook.

Vì đối tượng chính dùng Donve là **cá nhân, ít kỹ thuật**, phương án chọn là: **Donve tự đứng 1 App TikTok Developer dùng chung cho toàn nền tảng** (giống vai trò `FACEBOOK_APP_SECRET` — secret chung, không phải BYOK). Doanh nghiệp chỉ cần **bấm 1 nút "Kết nối tài khoản TikTok Ads"**, không cần tự tạo App, không cần tự làm việc với TikTok Developer Portal.

### F.2 Sơ đồ tổng quan

```
┌─ Doanh nghiệp bấm "Kết nối tài khoản TikTok Ads" trong Donve ─────┐
│  Link trỏ tới "Advertiser authorization URL" của App Donve         │
│  (kèm &state=<orgId>:<campaignId>)                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                            ▼
        Màn hình TikTok: doanh nghiệp đăng nhập, xem quyền, bấm Đồng ý,
        xác thực OTP qua email của tài khoản quảng cáo
                            ▼
        TikTok redirect về GET /webhooks/tiktok-oauth-callback
        ?state=<orgId>:<campaignId>&auth_code=...
                            │
                            ├─ Donve đổi auth_code → access_token (dùng App ID/Secret CHUNG)
                            ├─ Donve gọi POST /subscription/subscribe/ (subscribe_entity=LEAD)
                            │   đăng ký webhook, lưu subscription_id
                            └─ Redirect về Dashboard, hiện "Đã kết nối"
                            ▼
┌─ Có lead mới trên Instant Form ────────────────────────────────────┐
│  TikTok tự POST tới POST /webhooks/tiktok-leads?orgId=..&campaignId=..│
│  Body chứa SẴN đầy đủ tên/SĐT/email (khác Facebook — không cần gọi   │
│  ngược lại lấy thêm dữ liệu)                                         │
└──────────────────────────┬──────────────────────────────────────────┘
                            ├─ Donve verify Tiktok-Signature (ký bằng App Secret CHUNG)
                            ├─ findOrCreateLead() — dedupe theo SĐT
                            ├─ Lead mới → tự động gán người phụ trách (routing engine)
                            └─ Bắn realtime lên Dashboard
```

### F.3 Doanh nghiệp cần làm gì

1. Vào **Donve → Cài đặt → Webhook nhận lead** → chọn chiến dịch ở đầu trang → thẻ **"TikTok Lead Generation"**.
2. Bấm **"Kết nối tài khoản TikTok Ads"** → được đưa sang màn hình TikTok.
3. Đăng nhập tài khoản TikTok Ads (cá nhân hay công ty đều được — không cần pháp nhân, giống Facebook), xem danh sách quyền App Donve xin, bấm **Xác nhận**.
4. Bấm **Gửi mã** → nhập mã OTP gửi tới email của tài khoản quảng cáo → **Xác nhận**.
5. TikTok tự đưa bạn quay lại Donve, thẻ hiện **"Đã kết nối"** kèm tên tài khoản quảng cáo — xong, không có bước nào khác.
6. Từ giờ ai điền Instant Form quảng cáo của bạn, lead tự xuất hiện trong Donve theo thời gian thực.

Muốn ngắt kết nối: bấm **"Xoá"** trên thẻ — Donve tự huỷ subscription phía TikTok, không cần vào lại TikTok Developer Portal.

### F.4 Field mapping

| TikTok `entry[].changes[].field` | Map vào | Ghi chú |
| --- | --- | --- |
| `name` | `fullName` |  |
| `phone_number` | `phone` | chuẩn hoá theo định dạng VN |
| `email` | `email` | tuỳ chọn |
| Field khác (`gender`, `address`, `scheduled_time`, câu hỏi tuỳ chỉnh...) | lưu vào Trường tùy chỉnh của lead |  |

### F.5 Test thử mà không cần chờ TikTok thật

```bash
# Cần TIKTOK_APP_SECRET thật để tính đúng chữ ký — dùng khi đã có App TikTok thật
SECRET="TikTok App Secret"
TS=$(date +%s)
BODY='{"object":1,"entry":[{"id":"test-lead-1","changes":[{"field":"name","value":"Nguyen Van A"},{"field":"phone_number","value":"0912345678"}]}]}'
SIG=$(echo -n "${TS}.${BODY}" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')
curl -X POST "https://api.<domain>/webhooks/tiktok-leads?orgId=<orgId>&campaignId=<campaignId>" \
  -H "Content-Type: application/json" -H "Tiktok-Signature: t=$TS,s=$SIG" -d "$BODY"
```

Sai/thiếu `Tiktok-Signature` (hoặc quá 5 phút kể từ `t=`) → `401 invalid_webhook_signature`. Chưa cấu hình `TIKTOK_APP_ID`/`TIKTOK_APP_SECRET` → `501 tiktok_app_not_configured`. Đúng key, sai `campaignId` → `404 campaign_not_found`.

### F.6 Nguồn tham khảo đã xác nhận

Toàn bộ đặc tả (đăng ký subscription, chữ ký webhook, payload lead, đổi OAuth token, huỷ subscription) đọc được đầy đủ, **không cần đăng nhập** — chỉ cần trình duyệt thật (JS-rendered SPA, công cụ fetch HTML thường không đọc được, đã tự sửa lại đánh giá trước đó rằng trang này "cần đăng nhập"):

- [Create a subscription](https://business-api.tiktok.com/portal/docs/create-a-subscription/v1.3)
- [Cancel a subscription](https://business-api.tiktok.com/portal/docs/cancel-a-subscription/v1.3)
- [Webhook verification](https://business-api.tiktok.com/portal/docs/webhook-verification/v1.3)
- [Subscribe to ad account Webhook events via Subscription API](https://business-api.tiktok.com/portal/docs/subscribe-to-ad-account-webhook-events-via-subscription-api/v1.3) (payload `LEAD` mẫu đầy đủ)
- [Get an Instant Form lead or a direct message lead](https://business-api.tiktok.com/portal/docs/get-an-instant-form-lead-or-a-direct-message-lead/v1.3)
- [Marketing API Authorization](https://business-api.tiktok.com/portal/docs/marketing-api-authorization/v1.3) / [Authentication](https://business-api.tiktok.com/portal/docs/marketing-api-authentication/v1.3)

**Phần chưa tự kiểm tra được với tài khoản thật**: toàn bộ code đã viết đúng theo đặc tả trên nhưng **chưa gọi thật** (cần `TIKTOK_APP_ID`/`TIKTOK_APP_SECRET` thật — Donve cần tự tạo 1 App tại `business-api.tiktok.com/portal`, thêm sản phẩm Marketing API, bật quyền Lead Generation/Instant Form, và thêm URL `/webhooks/tiktok-oauth-callback` của Donve vào danh sách "advertiser redirect URLs" của App) — cùng mức độ cẩn trọng đã áp dụng cho Zalo Mini App (§B.3.3) và ZNS/eSMS (Phụ lục).

---

## Phụ lục kỹ thuật

Phần dưới đây dành cho dev, mô tả chi tiết implementation hiện tại.

### Sơ đồ luồng (mức code)

```
POST /webhooks/facebook-leads?orgId=...&campaignId=...    (HMAC-SHA256, X-Hub-Signature-256)
POST /webhooks/zalo-oa?orgId=...&campaignId=...            (SHA-256 thường, X-ZEvent-Signature)
POST /webhooks/generic-leads?orgId=...&campaignId=...      (Bearer API key — bridge/no-code tool bất kỳ)
POST /webhooks/google-ads-leads?orgId=...&campaignId=...   (key nằm trong JSON body, field `google_key`)
POST /webhooks/tiktok-leads?orgId=...&campaignId=...       (Tiktok-Signature — ký bằng TIKTOK_APP_SECRET chung)
GET  /webhooks/tiktok-oauth-callback?state=...&auth_code=... (OAuth redirect, không phải lead webhook)
        │
        ├─ 1. Verify chữ ký/key (401 nếu sai/thiếu — 5 cơ chế khác nhau hoàn toàn, không dùng chung code)
        ├─ 2. Facebook: resolveFacebookFieldData() — gọi Graph API nếu chỉ có leadgen_id
        ├─ 3. Parse + map field → {fullName, phone, email, customFields}
        ├─ 4. findOrCreateLead() — dedupe theo SĐT (chuẩn hoá qua normalizeVnPhone)
        ├─ 5. Nếu lead MỚI → routeLead() tự động gán người phụ trách + ghi consent
        └─ 6. publishNewLeads() → SSE bắn realtime lên dashboard
```

Route mount tại `/webhooks/*` (KHÔNG phải `/api/leads/*`) — nằm ngoài `requireOrgSession`. Rate-limit 60 req/phút/IP trên `/webhooks/*`; `/public/leads` (landing page, khác hẳn `/webhooks/generic-leads`) có CORS mở (`origin: "*"`, xem §C.3) + rate-limit riêng 30 req/phút/IP + bắt buộc Turnstile.

`webhookCredentials.provider` có 4 giá trị: `facebook`/`zalo_oa` (org tự dán secret từ bên thứ 3, fallback về secret chung nếu chưa cấu hình) và `generic`/`google_ads` (Donve tự sinh, không có fallback — org chưa tạo key thì mọi request bị `401`, không âm thầm cho qua; `POST /webhook-credentials/:provider/generate` dùng chung cho cả 2). TikTok đứng ngoài bảng này hoàn toàn — không có `webhookCredentials` row, dùng bảng riêng `tiktok_connections` (`packages/db/src/repositories/tiktok-connections.ts`) vì lưu `access_token` từ OAuth + `subscription_id`, không phải 1 secret đơn.

### Auto-assignment routing engine (`routing.ts`)

```
routeLead(lead):
  nếu lead.assigneeId đã có sẵn → return (cơ chế assignmentMode cấp campaign, có từ trước, ưu tiên hơn)
  lấy assignmentRules của org, sắp theo priority tăng dần
  tìm rule đầu tiên khớp: (matchCampaignId null HOẶC = lead.campaignId) VÀ (matchPersona null HOẶC = lead.persona)
  không rule nào khớp → để lead unassigned
  áp chiến lược: fixed_assignee | round_robin | least_active_leads
  nếu có assigneeId → update lead + ghi leadActivities loại "system"
  BẤT KỲ lỗi nào → chỉ log, KHÔNG throw (lead đã lưu, routing lỗi không được làm mất lead)
```

### SLA-breach sweep (`lib/lead-sla-sweep.ts`)

Chạy mỗi 30 phút (Cloudflare Worker cron `*/30 * * * *` + Bun `setInterval` tương ứng). Với mỗi org có rule đặt `slaHours`: lấy lead đang mở + đã gán, tìm rule khớp, nếu quá hạn và chưa xử lý (chống lặp qua `leadActivities.meta.kind`) → `reassign_next_in_pool` (chuyển người kế tiếp trong pool) hoặc `notify_manager` (ghi activity + gửi email tới chủ org qua `packages/drivers/src/notify`, xem §Việc còn thiếu).

### Bảo mật

| Rủi ro | Hiện trạng |
| --- | --- |
| Giả mạo cross-org | **Đã vá.** `webhookCredentials` (mã hoá AES-256-GCM, `WEBHOOK_KEY_MASTER_SECRET`) cho phép mỗi org tự cấu hình secret riêng qua Cài đặt → Webhook nhận lead. Org chưa cấu hình fallback về secret chung. Verify sống: secret riêng của 1 org thì secret chung/org khác không verify được (`401`). |
| CORS thiếu trên `/public/*` | **Đã vá** (§C.2) — phát hiện và sửa trong phiên rà soát tài liệu này, không phải lỗi lý thuyết. |
| GET verify challenge (Facebook) | Đã có — so khớp `verifyToken` theo org, `403` nếu sai. |
| Consent record cho lead qua webhook | Đã có — ghi `consents` giống form/CSV, `ip: null` vì webhook không có IP thật của lead. |
| Replay attack | Không có timestamp/nonce check — chấp nhận được vì dedupe theo SĐT chỉ tạo `merged`, không tạo lead trùng. |
| Rate-limit burst | 60 req/phút/IP dùng chung `/webhooks/*`. Facebook gửi burst lớn có thể bị `429` và tự retry. |
| Generic/Google Ads API key bị lộ (paste nhầm chỗ công khai, commit vào git...) | Org tự **Tạo lại** (rotate) trong Cài đặt bất kỳ lúc nào — key cũ mất hiệu lực ngay (không có thời gian gia hạn/overlap, xem `webhook-credentials.ts` `upsert` doc comment). Không có cách nào xem lại key cũ đã lộ hay chưa từng bị dùng sai — chấp nhận được vì hành động đúng khi nghi lộ luôn là rotate ngay, không phải điều tra lịch sử dùng. |
| Google Ads key nằm trong JSON body thay vì header | Đây là contract CHÍNH THỨC của Google (`google_key` là 1 field trong body, không phải header/HMAC — đã xác nhận qua tài liệu implementation guide, §E.5), không phải lựa chọn của Donve. So khớp bằng `timingSafeEqual` giống mọi provider khác — vẫn constant-time dù nằm trong body. |
| TikTok `Tiktok-Signature` ký bằng App Secret CHUNG, không phải per-org | Đây là bản chất mô hình OAuth shared-app của TikTok (§F.1), không phải lỗ hổng — khác Facebook/Zalo, TikTok không có khái niệm "App Secret của từng org", chỉ có `access_token` của từng advertiser (lấy qua OAuth, không phải secret org tự đặt). Đóng gói đúng: `orgId`/`campaignId` chỉ chọn nơi lead đổ vào, không phải cơ chế xác thực — xác thực thật nằm ở `Tiktok-Signature` + timestamp chống replay (5 phút, §F.4/verifyTiktokSignature). |
| TikTok access token không hết hạn — không có cách tự phát hiện khi advertiser thu hồi quyền | Chấp nhận được ở quy mô hiện tại: nếu advertiser thu hồi quyền phía TikTok, `POST /subscription/subscribe/` (lúc kết nối lại) hoặc chính webhook sẽ bắt đầu lỗi — org tự nhận ra qua việc lead ngừng đổ về và có thể **Kết nối lại** bất kỳ lúc nào (đăng ký subscription mới, không cần thao tác gì phía TikTok). Không có sweep job chủ động kiểm tra token còn hợp lệ hay không — thêm sau nếu cần. |

### Việc còn thiếu thật sự

- ~~Cầu nối Zalo Mini App~~ — **đã có** endpoint (`/webhooks/generic-leads`) + file Worker mẫu (§B.3.5). Còn thiếu duy nhất: xác nhận đúng endpoint giải mã token phía Zalo (§B.3.3, cần tài khoản Mini App thật để tra tài liệu đã đăng nhập).
- ~~Google Ads native route~~ — **đã build** (`/webhooks/google-ads-leads`, §E) — đặc tả lấy từ tài liệu chính thức Google, đọc được đầy đủ, không cần cảnh báo "chưa xác nhận được".
- ~~TikTok native route~~ — **đã build** (`/webhooks/tiktok-leads` + `/webhooks/tiktok-oauth-callback`, §F). Đặc tả đọc được đầy đủ không cần đăng nhập (đánh giá "cần đăng nhập" trước đó của tài liệu này là sai — do công cụ fetch HTML không chạy JS, đã tự sửa). Còn thiếu duy nhất: **Donve chưa tự tạo TikTok Developer App thật** để lấy `TIKTOK_APP_ID`/`TIKTOK_APP_SECRET`/`TIKTOK_ADVERTISER_AUTH_URL` — code đã sẵn sàng, chưa gọi thật lần nào (§F.6).
- ~~Zalo ZNS/SMS notify đa kênh~~ — **đã build, đúng mô hình BYOK.** Org tự đăng ký Zalo ZNS app / tài khoản eSMS.vn riêng, dán credential qua UI mới `/leads/notify-settings` (`notify-settings-page.tsx`) — Donve không giữ tài khoản nào. Backend: bảng `notify_credentials` (mã hoá bằng `NOTIFY_KEY_MASTER_SECRET` riêng, optional — thiếu thì route 501 thay vì crash), routes `PUT/DELETE /api/leads/notify-credentials/:provider`, driver `createZaloZnsNotifyChannel`/`createEsmsNotifyChannel` (`packages/drivers/src/notify`). Org chọn kênh đang dùng qua `organizations.settings.notifyChannel` (email mặc định/`zalo_zns`/`sms`) + `notifyPhone` (không có field điện thoại per-user trong hệ thống auth, nên đây là 1 số điện thoại quản lý dùng chung cho cả org). ⚠️ 2 endpoint bên ngoài (Zalo ZNS template-send, eSMS `SendMultipleMessage_V4_get`) được implement theo tài liệu công khai nhưng **chưa test với tài khoản thật** — xác nhận lại khi có tài khoản ZNS/eSMS thật, cùng mức độ cẩn trọng với `⚠️ CHƯA XÁC NHẬN ĐƯỢC` đã ghi ở Mini App bridge worker (§B.3.3). Org dùng ZNS cũng phải tự tạo template Zalo với đúng tên trường `lead_name`/`sla_hours`/`org_name`.
- ~~`notify_manager` chưa có kênh push riêng~~ — **đã build.** `packages/drivers/src/notify` là 1 dispatcher không phụ thuộc kênh cụ thể (`NotifyChannel` interface) — nay có đủ 3 implementation: `createEmailNotifyChannel` (mặc định, template `sla_breach_alert`), `createZaloZnsNotifyChannel`, `createEsmsNotifyChannel`. `lead-sla-sweep.ts`'s `resolveOrgNotifyTarget` chọn đúng kênh theo cấu hình từng org, fallback về email nếu BYOK channel chưa cấu hình.
- ~~Webhook URL chưa có UI chọn campaign tự động~~ — **đã build.** Trang Webhook nhận lead (`webhook-settings-page.tsx`) giờ có 1 dropdown "Chiến dịch" ở đầu trang; chọn xong, cả 4 URL (facebook/zalo_oa/generic/google_ads) tự điền đúng `&campaignId=` — nút Copy bị disable tới khi chọn chiến dịch, tránh copy nhầm URL thiếu campaignId.
- ~~Không có retry/dead-letter~~ — **đã build.** Mọi lỗi 500 thật sự (không phải `ApiError` — bad payload/campaign không tồn tại vẫn trả lỗi ngay như trước, retry không giúp gì) từ `ingestWebhookLead` (cả 4 route: facebook/zalo_oa/generic/google_ads) giờ được ghi vào bảng `webhook_delivery_failures` (`packages/db/src/schema/crm.ts`). Sweep định kỳ mỗi 15 phút (`apps/api/src/lib/webhook-delivery-sweep.ts`, cùng cơ chế cron/`setInterval` với `reconcilePublishState`/`runLeadSlaSweep`) tự động thử lại; sau 5 lần thử fail liên tục, row chuyển `dead_letter` (còn `lastError` để tra) thay vì retry vô hạn.
- ~~Generic API key: không có UI xem "lần dùng gần nhất"~~ — **đã build**, nay áp dụng cho cả `generic` và `google_ads`. `webhook_credentials.last_used_at` được ghi mỗi lần `/webhooks/generic-leads` hoặc `/webhooks/google-ads-leads` xác thực thành công (kể cả khi lead sau đó bị lỗi) — 2 thẻ tương ứng trong Cài đặt hiện dòng "Lần dùng gần nhất: ..." hoặc "Chưa từng được dùng". Cột này chưa nối cho facebook/zalo_oa; có thể tái dùng cùng cột sau mà không cần đổi schema.
