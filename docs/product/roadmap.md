# Roadmap: xây theo lớp, không theo lịch tìm user

Giai đoạn hiện tại **không đi tìm người dùng thật bên ngoài** — cột mốc là "founder tự vận hành 100% doanh nghiệp thật của mình bằng chính nền tảng, không cần vá tay bằng Excel/tin nhắn". Khi mốc đó đạt, việc mở ra ngoài (design partner, pricing thật) mới bắt đầu — không nằm trong phạm vi roadmap này.

## Lớp 0 — Core loop chạy đầu-cuối không đứt gãy

Mục tiêu: một offer thật của founder đi trọn vẹn qua toàn bộ core loop trong thesis.md mà không cần thao tác thủ công ngoài nền tảng (trừ các bước đã chủ động để thủ công ở giai đoạn này, xem dưới).

- Tạo/publish một offer (landing + form + giá) ra link sống.
- Lead vào một chỗ duy nhất, có trạng thái + next action, không rơi rớt giữa các kênh.
- Khách chuyển khoản → đối soát tự động (SePay/VietQR); trường hợp không khớp → vào hàng đợi xử lý tay có gợi ý, không im lặng biến mất.
- Đơn đã trả tiền → có một việc "cần giao" hiển thị rõ, đánh dấu xong được.
- Nhìn lại được: offer/nguồn nào tạo ra đơn đã thanh toán.

**Có thể làm thủ công ở lớp này** (không chặn tiến độ): follow-up nhắn khách, gửi nội dung fulfillment, refund, custom domain, đa thành viên.

**Đã rà (2026-09-04) — kết luận: core loop nối thật đầu-cuối, không phải scaffold.**

- Publish→serve, lead→route→SLA sweep (kèm notify email/Zalo ZNS/SMS thật), webhook→match/unmatched→resolve, paid→fulfillment task→complete: xác nhận bằng đọc code + evidence file:line.
- **Đã vá xong: source-link giờ gắn thật vào lead/order.** Thêm cột `sourceLinkId` (nullable) vào `leads` và `orders` (migration `0005_tranquil_cerise.sql`), resolve tại `findOrCreateLead` bằng khớp UTM (`utm_source/utm_medium/utm_campaign/utm_content`) với `sourceLinks`, propagate sang order khi tạo. Có test tích hợp thật (`apps/api/test/public-leads-source-link.integration.test.ts`, 2/2 pass ổn định qua 5 lần chạy) — không còn là lỗ hổng.
- **Đã xoá: tính năng "convert-to-native".** Không cần thiết vì đường sửa trực tiếp trên HTML import (AI-chat diff) đã đủ tốt — loại bỏ luôn rủi ro convert một chiều/mất fidelity. Xem `decisions.md`.
- **Đã xác nhận bằng test tích hợp thật chạy trên Postgres thật (testcontainers), không chỉ đọc code:** `webhooks-sepay.integration.test.ts` (10/10), `refund-requests.integration.test.ts` (3/3), `public-leads-source-link.integration.test.ts` (2/2). Lưu ý vận hành: chạy nhiều file testcontainers cùng lúc trong 1 lệnh `bun test` bị đụng port ngẫu nhiên (không phải bug code) — chạy từng file riêng khi verify thủ công.

**Đã viết + chạy Playwright E2E thật qua browser thật** (`apps/donve/e2e/core-loop.spec.ts`, lệnh chạy lại: `cd apps/donve && bunx playwright test --config e2e/playwright.config.ts`, yêu cầu `docker compose up -d` + `bun run dev` + seed-accounts đã chạy). Dùng đúng file `temp/xay-kenh-viral-v33-3-khoa.zip` làm fixture. Kết quả 2/2 pass ổn định.

**Bug thật tìm thấy và đã vá qua chính E2E này (2026-09-04):** import ZIP/HTML sinh ra bởi AI cá nhân của user — form field detection (cả backend `apps/api/src/lib/custom-import.ts` lẫn bản duplicate ở frontend `lead-form-wizard.tsx`) chỉ nhận diện field qua thuộc tính `name`, bỏ sót field chỉ có `id` (rất phổ biến ở HTML AI tự sinh — đúng file demo của founder bị dính lỗi này với cả 3 field tên/SĐT/email). Đã sửa: fallback sang `id` khi không có `name`, ở cả 2 nơi. Có test đơn vị (`apps/api/test/custom-import.test.ts`) và test E2E thật xác nhận file ZIP thật của founder giờ wire được lead form qua UI, không cần sửa tay HTML.

**Lớp 0 coi như xong** — core loop đã verify ở cả 3 tầng: đọc code, integration test trên Postgres thật, và E2E browser thật với dữ liệu demo thật. Việc tiếp theo là Lớp 1.

## Lớp 1 — Làm sắc wedge: không để lọt tiền/lead

Sau khi Lớp 0 chạy được, tập trung vào đúng lý do mở app mỗi ngày: một màn hình/luồng gộp được "lead chưa liên hệ + tiền chưa đối soát + đơn chưa giao" thành một danh sách việc cần làm hôm nay, xếp theo mức độ khẩn (tiền đã vào nhưng chưa giao > lead mới chưa liên hệ > đối soát tồn đọng).

Không xây thêm module mới ở lớp này — chỉ làm rõ và gộp dữ liệu đã có.

**Đã làm xong (2026-09-04):**

- **Bug thật tìm thấy và vá: màn hình "Hôm nay" luôn hiện sai số 0.** `GET /api/leads/operating-summary` (`apps/api/src/modules/leads/routes.ts`) tính khoảng "hôm nay" bằng `end = new Date(start)` — tức `end` trùng y hệt `start` (nửa đêm), nên mọi điều kiện lọc `gte(start) AND lte(end)` là khoảng rỗng, luôn trả về 0 lead/đơn/doanh thu hôm nay bất kể có hoạt động thật. Không có test nào cho endpoint này nên bug tồn tại âm thầm. Đã sửa (`end` = cuối ngày UTC) và thêm test tích hợp thật (`apps/api/test/operating-summary.integration.test.ts`) xác nhận số liệu đúng.
- **Gộp đúng thứ tự ưu tiên:** `nextActions` trong cùng endpoint giờ trả về đúng thứ tự fulfillment (tiền đã vào chưa giao) → lead mới → đối soát tồn đọng, thay vì thứ tự cũ sai (lead → payment → fulfillment).
- **Gộp UI:** trang `/today` (`apps/donve/src/features/today/components/today-page.tsx`) trước đây có 2 khối trùng lặp (1 lưới 3 thẻ đếm không đúng ưu tiên + 1 danh sách "việc tiếp theo" riêng) — đã gộp thành **một** danh sách ưu tiên duy nhất ngay đầu trang, mỗi dòng có icon phân biệt mức khẩn (fulfillment tô màu destructive). Bỏ 2 lượt gọi API dư thừa (fetch toàn bộ lead + toàn bộ unmatched transactions chỉ để đếm) vì `operating-summary` đã có đủ số liệu. Verify bằng Playwright thật (`apps/donve/e2e/today-page.spec.ts`) — trang render đúng, không lỗi console (ngoại trừ 1 warning `Base UI nativeButton` có sẵn từ trước ở pattern `Button render={<Link/>}` dùng khắp app, ngoài phạm vi lớp này, ghi nhận là nợ kỹ thuật riêng chưa xử lý).

**Lớp 1 coi như xong** ở phần dữ liệu + màn hình chính. Việc tiếp theo: Lớp 2 khi có nhu cầu thật.

## Lớp 2 — Ứng viên mở rộng (thứ tự ưu tiên nếu có capacity dư)

Chỉ mở khi Lớp 0 + 1 đã ổn định và founder tự dùng thật hàng ngày. Thứ tự dưới đây là gợi ý, không phải cam kết — quyết định mở cái nào dựa trên việc nó có phục vụ trực tiếp core loop hay không, không dựa trên việc "nghe hay":

1. Ổn định thêm kênh social ingest (Zalo OA, TikTok) nếu đang là nguồn lead chính của founder.
2. Thêm provider thanh toán thứ hai (VNPAY/MoMo/Casso/PayOS) — chỉ khi SePay đã chứng minh ổn định.
3. Tự động hoá fulfillment cho sản phẩm số (gửi link/nhóm tự động sau khi đối soát xong).
4. Content-to-cash attribution sâu hơn (biết chính xác nội dung/link nào ra tiền, không chỉ offer nào).
5. Mở multi-member/team sales — chỉ khi thật sự có hơn một người vận hành.

**Không làm ở giai đoạn này dù có capacity dư:** marketplace, white-label agency, logistics/inventory, A/B testing, LMS đầy đủ, omnichannel inbox hoàn chỉnh, email/ZNS sequence engine. Lý do: chưa có bằng chứng nội bộ nào cho thấy các thứ này phục vụ core loop — thêm vào bây giờ là suy đoán, không phải nhu cầu đã thấy.

## Cách quyết định khi có ý tưởng mới (kể cả từ ChatGPT hay bất kỳ đâu)

Chỉ hỏi một câu: **ý tưởng này phục vụ bước nào trong core loop, hay nó là một core loop/wedge khác?**

- Phục vụ một bước cụ thể → xếp vào đúng lớp ở trên theo mức ưu tiên.
- Không phục vụ bước nào, hoặc đề xuất một mô hình kinh doanh khác hẳn → ghi lại một dòng trong `decisions.md` mục "ý tưởng gác lại", không triển khai, không bàn thêm cho tới khi Lớp 0+1 xong.

Đây là cơ chế duy nhất để tránh quay lại trạng thái "mông lung" mỗi khi có một hướng mới nghe hấp dẫn.
