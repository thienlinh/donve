# 01 — Phân tích Business

## 1. Tầm nhìn sản phẩm

**Một câu:** Nền tảng vertical cho creator/educator/SME Việt Nam: dùng AI tạo landing page đạt chuẩn SEO & tốc độ, gắn thẳng vào phễu bán hàng hoàn chỉnh (form → CRM → thanh toán VietQR/SePay → kích hoạt khoá học/Zalo) mà không cần biết code.

Điểm khác biệt cốt lõi so với "page builder" thuần: **landing page không phải sản phẩm cuối — phễu doanh thu mới là sản phẩm cuối.** Landing chỉ là điểm vào; giá trị nằm ở chuỗi tự động phía sau (lead capture → sales pipeline → payment reconciliation → fulfillment).

Điều này khớp với chiến lược bạn đã chốt trước đó: **vertical platform thay thế Pancake trong ngách creator/khoá học**, dùng chính content dạy học của bạn làm kênh GTM, thay vì cạnh tranh omnichannel messaging trực diện.

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

## 3. Đối thủ & định vị

| | LadiPage | Webcake | Pancake POS/CRM | Nền tảng này |
|---|---|---|---|---|
| Builder | Drag-drop truyền thống, learning curve cao | Drag-drop, template VN | Không có builder thực thụ | **AI-first: chat → generate → chỉnh bằng comment/select**, không cần học tool |
| Tốc độ trang | Trung bình (nhiều JS runtime) | Trung bình | — | HTML tĩnh thuần, edge VN, CWV xanh |
| CRM | Cơ bản, add-on | Cơ bản | Mạnh về omnichannel chat | CRM gắn chặt phễu khoá học/sản phẩm, pipeline sales |
| Thanh toán VN | Tích hợp cổng | Có | Có | VietQR + SePay webhook reconciliation tự động + fallback Zalo thủ công |
| Giá | Theo năm, khá cao với cá nhân | Freemium | Theo shop | Freemium → trả theo tenant, rẻ nhờ hạ tầng edge/VPS tối ưu |
| AI | Bolt-on | Bolt-on | — | Lõi sản phẩm (studio + prompt/skills manager) |

**Định vị:** "Lovable/v0 cho phễu bán hàng Việt Nam" — nhưng output không phải app, mà là **phễu doanh thu chạy được ngay** với thanh toán nội địa.

## 4. Business model

1. **Subscription theo tenant** (đề xuất):
   - Free: 1 landing, subdomain nền tảng, 50 leads/tháng, AI dùng BYOK key của user.
   - Starter (~199–299k/tháng): 5 landing, 1.000 leads, custom domain, SePay automation, AI credits kèm gói.
   - Pro (~499–799k/tháng): unlimited landing, team sales, prompt/skills riêng, ưu tiên support.
2. **AI credits** (nếu dùng platform key): mua thêm token — margin trên API cost. Với BYOK thì user tự trả, nền tảng không gánh chi phí AI ở free tier (quan trọng cho giai đoạn đầu).
3. **Khoá học/coaching của chính bạn**: kênh GTM + doanh thu song song; học viên tốt nghiệp trở thành tenant trả phí (flywheel dogfooding).
4. Tương lai: transaction fee nhỏ trên đơn qua SePay automation (opt-in), template marketplace.

## 5. North-star & metrics

- **North-star: số đơn thanh toán thành công được reconcile tự động qua nền tảng / tuần.** (Đo đúng giá trị cốt lõi: phễu chạy end-to-end.)
- Activation: tenant publish landing đầu tiên < 30 phút kể từ đăng ký.
- AI quality: % landing generate đạt Lighthouse ≥ 95 không cần sửa tay.
- CRM: thời gian từ lead mới → first contact của sales.
- Retention: tenant có ≥ 1 campaign active sau 60 ngày.

## 6. Phạm vi phiên bản đầu (production-grade, không phải MVP cắt gọt)

**Trong phạm vi:** Studio đầy đủ (như screenshots), publish subdomain, campaign/product/course management, lead CRM + pipeline, checkout VietQR + SePay webhook + manual fallback + Zalo, prompt/skills manager, import HTML, BYOK, team & phân quyền, audit log, analytics cơ bản (view/submit/conversion).

**Ngoài phạm vi v1 (roadmap):** A/B testing, email/ZNS automation sequence, template marketplace, white-label agency, affiliate tracking, form builder nâng cao (logic nhảy bước), đa ngôn ngữ landing.

## 7. Rủi ro business

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| User non-tech vẫn thấy studio phức tạp | Cao | Mode "đơn giản" mặc định: chỉ chat + comment; ẩn layer tree/edit properties sau toggle "Nâng cao" |
| Phụ thuộc ToS AI provider (BYOK/OAuth thay đổi) | Trung | Multi-provider ngay từ đầu (Claude + OpenAI + đường OpenRouter), abstraction layer, xem ai-integration-byok.md |
| SePay đổi API/chính sách | Trung | Payment provider interface; fallback manual luôn tồn tại như first-class flow |
| Chi phí AI vượt kiểm soát ở free tier | Cao | Free tier bắt buộc BYOK; platform credits chỉ ở gói trả phí |
| Cạnh tranh copy tính năng | Thấp-Trung | Moat = cộng đồng học viên + skills/prompt library tiếng Việt tối ưu chuyển đổi |
