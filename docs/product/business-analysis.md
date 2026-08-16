# 01 — Phân tích Business

## 1. Tầm nhìn sản phẩm

**Một câu:** Nền tảng vertical cho creator/educator/SME Việt Nam: dùng AI tạo landing page đạt chuẩn SEO & tốc độ, gắn thẳng vào phễu bán hàng hoàn chỉnh (form → CRM → thanh toán VietQR/SePay → kích hoạt khoá học/Zalo) mà không cần biết code.

Điểm khác biệt cốt lõi so với "page builder" thuần: **landing page không phải sản phẩm cuối — phễu doanh thu mới là sản phẩm cuối.** Landing chỉ là điểm vào; giá trị nằm ở chuỗi tự động phía sau (lead capture → sales pipeline → payment reconciliation → fulfillment).

Phạm vi ban đầu: **dùng cho chính bạn và nhóm người quen/học viên trong kênh dạy học của bạn** — không phải để cạnh tranh trực diện với ai. Nếu sau này có người ngoài nhóm này cần dùng, nền tảng mở rộng thành sản phẩm bán được; nhưng thiết kế v1 tối ưu cho "công cụ tự dùng tốt" trước, "sản phẩm bán ra" là kết quả phụ nếu nó tốt thật.

## 2. Personas

### P1 — "Cô giáo Yoga / Chuyên gia tự do" (primary)

- Bán khoá học, workshop qua Zalo/Facebook/TikTok. Không biết code, sợ kỹ thuật.
- Đang dùng: Google Form + chuyển khoản thủ công + Excel, hoặc Webcake/LadiPage bản rẻ.
- Pain: tạo landing mất nhiều ngày, không biết viết copy, không track được ai đã chuyển khoản, sót lead.
- Cần: gõ mô tả → có landing đẹp; xem danh sách người đăng ký; biết ai đã thanh toán.
- **Đây chính là các option trong dropdown form ở screenshot #7** ("Chủ doanh nghiệp", "Người làm nghề tự do có chuyên môn", "Người bán hàng online", "Người làm affiliate", "Đã có kênh nhưng chưa ra kết quả", "Mới bắt đầu", "Muốn thêm nguồn thu") — form phân loại persona ngay tại lead capture.

### P2 — "Học viên của bạn / Người học làm content automation" (primary, GTM channel)

- Học theo kênh TikTok của bạn, muốn tự deploy landing và kiếm tiền — mô hình "dạy khách hàng deploy & monetize" bạn đang vận hành.
- Kỹ thuật lưng chừng: dùng được Claude/ChatGPT bên ngoài để generate HTML → **cần tính năng Import** để đưa vào nền tảng chỉnh sửa + gắn phễu.

### P3 — "Nhân viên Sales của tenant" (secondary)

- Vào CRM xử lý lead: gọi điện, ghi chú, đổi trạng thái, xác nhận chuyển khoản thủ công, active khoá học.
- Cần: kanban/danh sách lọc nhanh, mobile-friendly, thông báo lead mới.

### P4 — "Agency nhỏ" (tertiary, mở rộng sau)

- Quản lý nhiều campaign cho nhiều client → cần multi-workspace, phân quyền, white-label (roadmap).

## 3. Định vị

**Định vị:** "Lovable/v0 cho phễu bán hàng Việt Nam" — nhưng output không phải app, mà là **phễu doanh thu chạy được ngay** với thanh toán nội địa: AI-first (chat → generate → chỉnh bằng comment/select, không cần học tool builder), HTML tĩnh thuần chạy edge VN (CWV xanh), CRM gắn chặt phễu khoá học/sản phẩm, VietQR + SePay reconciliation tự động + fallback thủ công.

## 4. Business model

1. **Subscription theo tenant** (đề xuất):
   - Free: 1 landing, subdomain nền tảng, 50 leads/tháng, AI dùng BYOK key của user.
   - Starter (~199–299k/tháng): 5 landing, 1.000 leads, custom domain, SePay automation, AI credits kèm gói.
   - Pro (~499–799k/tháng): unlimited landing, team sales, prompt/skills riêng, ưu tiên support.
   - **Chưa chốt bằng khảo sát thực tế** — mức giá trên là ước lượng ban đầu; xác nhận với 10–20 người dùng thuộc persona P1/P2 trước khi tính phí thật (không cấp bách khi còn dùng nội bộ).
2. **AI credits** (nếu dùng platform key): mua thêm token — margin trên API cost. Với BYOK thì user tự trả, nền tảng không gánh chi phí AI ở free tier (quan trọng cho giai đoạn đầu).
3. **Khoá học/coaching của chính bạn**: kênh GTM + doanh thu song song; học viên tốt nghiệp trở thành tenant trả phí (flywheel dogfooding).
4. **Mô hình dòng tiền — non-custodial, nền tảng không giữ tiền hộ ai**: mỗi tenant tự kết nối tài khoản thanh toán **của chính họ** — SePay là driver mặc định v1 (đơn giản nhất cho tài khoản ngân hàng cá nhân/hộ kinh doanh nhỏ), nhưng mô hình áp dụng như nhau cho **bất kỳ provider nào tenant tự đăng ký**: VNPAY, MoMo, Casso, PayOS... (kỹ thuật: `packages/drivers/payments`, danh sách driver ở functional-requirements.md FR-D-10; giống cách BYOK hoạt động với AI key — `ai-integration-byok.md`). Toàn bộ tiền từ khách hàng (lead) chuyển thẳng vào tài khoản/ví của tenant tại provider họ chọn; nền tảng chỉ **đọc** thông báo giao dịch qua webhook/callback (đã cấu hình theo org) để tự động đối soát mã đơn, không có bước nào tiền đi qua tài khoản trung gian của nền tảng.
   - **Vì sao chọn mô hình này:** hoạt động "trung gian thanh toán" (giữ hộ/tổng hợp tiền của nhiều merchant rồi phân phối lại) là dịch vụ có điều kiện, cần giấy phép của Ngân hàng Nhà nước theo quy định hiện hành. Mô hình non-custodial (nền tảng chỉ cung cấp phần mềm đọc/đối soát, tiền không đi qua nền tảng, mỗi tenant là chủ tài khoản nhận tiền trực tiếp) không thuộc phạm vi đó — nền tảng đứng ở vai trò SaaS/phần mềm kế toán-đối soát, không phải bên xử lý thanh toán. Chọn VNPAY/MoMo càng củng cố vị trí này hơn nữa vì hai đơn vị đó **đã tự có giấy phép trung gian thanh toán** và tự KYC merchant — nền tảng chỉ tích hợp kỹ thuật bằng thông tin/credential tenant tự cung cấp, không đứng tên hộ ai ở bất kỳ provider nào.
   - **Hệ quả thiết kế:** tenant là người đứng tên hợp đồng/tài khoản với provider họ chọn (KYC do chính provider đó thực hiện với tenant, không phải nền tảng đứng tên hộ); nền tảng không bao giờ nắm giữ số dư hay thực hiện lệnh chuyển tiền ở bất kỳ provider nào; hoàn tiền (xem §7 Rủi ro và functional-requirements.md Module D) là thao tác tenant tự làm, nền tảng chỉ hỗ trợ tracking. Vì tenant đa số non-tech (persona P1), mỗi provider cần trang hướng dẫn kết nối từng bước (FR-D-15) — tự kết nối được không có nghĩa là tự biết cách làm.
   - Đây là quyết định cần giữ nguyên khi mở rộng thêm provider — không nên "tiện" gộp tiền nhiều tenant vào 1 tài khoản trung gian dù kỹ thuật dễ hơn, vì sẽ đổi hoàn toàn phân loại pháp lý của nền tảng, bất kể dùng provider nào.
5. Tương lai: transaction fee nhỏ trên đơn qua payment automation (opt-in — thu phí dịch vụ phần mềm, không phải phí trên dòng tiền vì nền tảng không giữ tiền), template marketplace.

## 5. Kênh tiếp cận (GTM)

Ưu tiên hiện tại: **kênh dạy học/TikTok cá nhân của bạn** — đủ và đúng cho giai đoạn "dùng cho mình + người quen". Không cần đầu tư đa kênh ngay, nhưng ghi nhận rủi ro phụ thuộc một kênh (xem §7) và giữ sẵn vài lối mở rộng rẻ, không tốn công riêng, khi/nếu cần vượt ra ngoài nhóm ban đầu:

- **Repurpose nội dung đã có**: TikTok → cắt lại thành YouTube Shorts/Facebook Reels, không tạo nội dung mới, chỉ đăng thêm nơi khác.
- **Dogfooding tự nhiên**: mỗi landing publish là một trang thật chạy trên `*.donve.vn` — theo thời gian tự thành showcase/backlink, không cần chiến dịch riêng.
- **Zalo OA cho học viên cũ**: kênh 1-chiều rẻ để thông báo tính năng mới, không phải kênh acquisition mới nhưng giữ nhóm hiện có gắn bó.
- **Truyền miệng trong nhóm học viên**: không cần dựng chương trình affiliate/referral chính thức ở v1 — nếu học viên tự giới thiệu, chỉ cần một cách đơn giản để họ làm điều đó (ví dụ share link landing của chính mình), không cần cơ chế thưởng phức tạp.

Không coi đây là kế hoạch phải triển khai ngay — chỉ là danh sách "biết sẵn sẽ làm gì" nếu kênh chính chững lại, tránh bị động hoàn toàn.

## 6. North-star & metrics

- **North-star: số đơn thanh toán thành công được reconcile tự động qua nền tảng / tuần.** (Đo đúng giá trị cốt lõi: phễu chạy end-to-end.)
- Activation: tenant publish landing đầu tiên < 30 phút kể từ đăng ký.
- AI quality: % landing generate đạt Lighthouse ≥ 95 không cần sửa tay.
- CRM: thời gian từ lead mới → first contact của sales.
- Retention: tenant có ≥ 1 campaign active sau 60 ngày.

## 7. Phạm vi phiên bản đầu (production-grade, không phải MVP cắt gọt)

**Trong phạm vi:** Studio đầy đủ (như screenshots), publish subdomain, campaign/product/course management, lead CRM + pipeline, checkout VietQR + SePay webhook + manual fallback + Zalo, prompt/skills manager, import HTML, BYOK, team & phân quyền, audit log, analytics cơ bản (view/submit/conversion).

**Ngoài phạm vi v1 (roadmap):** A/B testing, email/ZNS automation sequence, template marketplace, white-label agency, affiliate tracking, form builder nâng cao (logic nhảy bước), đa ngôn ngữ landing.

## 8. Rủi ro business

| Rủi ro | Mức | Giảm thiểu |
| --- | --- | --- |
| User non-tech vẫn thấy studio phức tạp | Cao | Mode "đơn giản" mặc định: chỉ chat + comment; ẩn layer tree/edit properties sau toggle "Nâng cao" |
| Phụ thuộc ToS AI provider (BYOK/OAuth thay đổi) | Trung | Multi-provider ngay từ đầu (Claude + OpenAI + đường OpenRouter), abstraction layer, xem ai-integration-byok.md — theo dõi ToS định kỳ hàng quý, không chỉ đọc một lần (chi tiết ai-integration-byok.md §1.4) |
| SePay đổi API/chính sách | Trung | Payment provider interface; fallback manual luôn tồn tại như first-class flow |
| Chi phí AI vượt kiểm soát ở free tier | Cao | Free tier bắt buộc BYOK; platform credits chỉ ở gói trả phí |
| GTM phụ thuộc một kênh cá nhân (TikTok) | Trung | Chấp nhận được ở giai đoạn "dùng cho mình + người quen" (§5); trước khi mở rộng ra ngoài nhóm này, kích hoạt các kênh dự phòng đã liệt kê ở §5 thay vì phụ thuộc hoàn toàn 1 kênh |
| Sai lệch mô hình dòng tiền khi mở rộng (vd bị "tiện tay" gộp tiền nhiều tenant) | Cao nếu xảy ra | Giữ nguyên tắc non-custodial ở §4.4 bất kể áp lực kỹ thuật/vận hành; mọi thay đổi hướng "giữ tiền hộ" phải review pháp lý trước khi code |
