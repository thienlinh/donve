# Business & Functional Scope

## Tầm nhìn

Nền tảng vertical cho creator/educator/SME Việt Nam: AI tạo landing page chuẩn SEO/tốc độ, gắn thẳng vào phễu bán hàng hoàn chỉnh (form → CRM → thanh toán VietQR/SePay → kích hoạt khoá học/Zalo), không cần biết code. Landing không phải sản phẩm cuối — **phễu doanh thu** mới là sản phẩm cuối; giá trị nằm ở chuỗi lead capture → sales pipeline → payment reconciliation → fulfillment.

Phạm vi ban đầu: dùng cho chính founder + nhóm học viên trong kênh dạy học (TikTok) của founder, không cạnh tranh trực diện thị trường page-builder. Mở rộng ra ngoài nhóm này là kết quả phụ, không phải mục tiêu v1.

**Personas:** P1 "Cô giáo Yoga/chuyên gia tự do" (primary, non-tech, bán khoá học qua Zalo/FB/TikTok) · P2 "Học viên" (primary GTM channel, kỹ thuật lưng chừng, cần Import HTML tự generate bên ngoài) · P3 "Sales của tenant" (secondary, CRM/kanban) · P4 "Agency nhỏ" (tertiary, roadmap: multi-workspace/white-label).

**Định vị:** "Lovable/v0 cho phễu bán hàng Việt Nam" — output là phễu doanh thu chạy được ngay (không phải app): AI-first chat→generate→edit, HTML tĩnh chạy edge VN, CRM gắn liền phễu, VietQR+SePay reconciliation tự động + fallback thủ công.

## Business model

- **Subscription theo tenant** (giá chưa chốt bằng khảo sát thực tế): Free (1 landing, subdomain, 50 leads/tháng, AI BYOK) · Starter (~199–299k/tháng: 5 landing, 1.000 leads, custom domain, SePay automation) · Pro (~499–799k/tháng: unlimited, team sales, prompt/skills riêng).
- **AI credits**: platform key = margin trên API cost; BYOK = user tự trả, nền tảng không gánh chi phí AI ở free tier.
- **Khoá học/coaching của founder**: kênh GTM song song — học viên tốt nghiệp thành tenant trả phí (dogfooding flywheel).
- **Dòng tiền non-custodial**: nền tảng không giữ tiền hộ ai. Mỗi tenant tự kết nối tài khoản thanh toán của chính họ (SePay driver mặc định v1, mở rộng VNPAY/MoMo/Casso/PayOS về sau — `packages/drivers/payments`). Tiền chuyển thẳng vào tài khoản tenant tại provider họ chọn; nền tảng chỉ **đọc** webhook để đối soát. Lý do: giữ hộ/gộp tiền nhiều merchant là hoạt động trung gian thanh toán cần giấy phép NHNN — mô hình non-custodial giữ nền tảng ở vai trò SaaS đối soát, không phải bên xử lý thanh toán. Đây là quyết định giữ nguyên khi thêm provider mới, không được "tiện tay" gộp tài khoản dù kỹ thuật dễ hơn. Hoàn tiền là thao tác tenant tự làm, nền tảng chỉ hỗ trợ tracking.
- Tương lai: transaction fee nhỏ (phí dịch vụ phần mềm, opt-in) trên đơn qua payment automation; template marketplace.

## GTM & north-star

Kênh chính: TikTok cá nhân của founder (đủ cho giai đoạn "dùng cho mình + người quen"), dự phòng rẻ khi cần mở rộng: repurpose nội dung sang YouTube Shorts/FB Reels, mỗi landing publish tự thành showcase (`*.donve.vn`), Zalo OA cho học viên cũ, truyền miệng (share link, không cần chương trình affiliate chính thức ở v1).

North-star: **số đơn thanh toán thành công reconcile tự động/tuần**. Metrics phụ: activation (publish landing đầu < 30 phút), % landing đạt Lighthouse ≥ 95 không sửa tay, thời gian lead→first contact, retention (≥1 campaign active sau 60 ngày).

**Phạm vi v1 (production-grade):** Studio đầy đủ, publish subdomain, campaign/product/course, lead CRM+pipeline, checkout VietQR+SePay+manual+Zalo, prompt/skills manager, import HTML, BYOK, team/RBAC, audit log, analytics cơ bản. **Ngoài phạm vi:** A/B testing, email/ZNS sequence automation, template marketplace, white-label agency, affiliate tracking, form logic nhảy bước, đa ngôn ngữ landing.

**Rủi ro chính:** non-tech thấy Studio phức tạp (→ mode "đơn giản" mặc định) · phụ thuộc ToS AI provider (→ multi-provider từ đầu) · SePay đổi API (→ driver interface + manual fallback) · chi phí AI free tier (→ BYOK bắt buộc ở free) · GTM phụ thuộc 1 kênh (→ chấp nhận được ở giai đoạn hiện tại, kênh dự phòng đã liệt kê) · sai lệch mô hình non-custodial khi mở rộng (→ mọi thay đổi hướng "giữ tiền hộ" phải review pháp lý trước khi code).

## Functional requirements (FR-\<module\>-\<số\>, P0 bắt buộc v1 / P1 nên có / P2 roadmap)

**A — Auth, Tenant & Team:** đăng ký/login email+Google/FB OAuth, xác thực email (P0) · org/tenant + chuyển đổi (P0) · roles owner/admin/editor/sales (P0) · invite email 7 ngày (P0) · audit log hành động ghi (P1) · 2FA TOTP (P2).

**B — Landing Studio:** trang `/landings` lưới card + prompt tạo mới + filter/sort (P0) · card actions đổi tên/nhân bản/xoá (P1) · layout chat sidebar + Design Files + canvas preview iframe sandboxed (P0) · zoom/pan/fit-to-screen (P0) · mode view/select/comment/draw: hover border+label, click chọn, edit properties panel, inline text edit (P0), comment mode gửi vào chat (P0), queue+send-all comments (P0), draw mode annotate (P1) · undo/redo ≥100 bước (P0) · layer tree list/toggle visibility/click-select (P0), rename layer (P1), drag-reorder qua dnd-kit (P1) · chat streaming AI + generate lần đầu (P0) · edit qua patch có cấu trúc trên srcmap, fallback full-file (P0) · mỗi lượt AI = 1 version (P0) · chọn design system inject token (P1) · voice input (P2) · project files (assets/Page.html/srcmap/thumbnail) (P0) · version history 2 chiều với chat (P0) · export HTML/ZIP/PNG (P0) · upload ảnh+video vào assets, nén WebP/AVIF, cap dung lượng (P0) · nguồn ảnh: ưu tiên upload tenant > stock có license (Unsplash/Pexels), hỏi trước khi chèn stock, ghi source+license (P0), AI tự sinh ảnh chưa bật v1 (P1 roadmap) · import HTML/ZIP/link công khai, sanitize+srcmap+auto layer naming (P0), flag ảnh nguồn không rõ (P1), wizard chuẩn hoá phễu sau import (P1).

**C — Campaign/Product/Course:** CRUD Product (P0, form pattern react-hook-form+zod dùng chung) · CRUD Course (P0) · CRUD Campaign gắn product+landing+form config+payment config (P0) · gắn landing↔campaign 1-n (P0) · dashboard campaign views/submit/conversion (P1) · object type mới không đổi DB (P2).

**D — Form, Checkout & Payment:** runtime script nhẹ bắt submit/validate/popup/poll (P0) · form fields chuẩn + libphonenumber-js (P0) · chống spam Turnstile+rate limit+honeypot (P0) · tạo Order với mã đơn base32+checksum, VietQR quick-link (P0) · webhook provider theo org, idempotent, match tuyệt đối rồi fuzzy có checksum, ghi unmatched khi ambiguous (P0) · nút "đã chuyển khoản" → awaiting_confirmation (P0) · poll trạng thái đơn 10 phút (P0) · state machine order + log lý do đổi trạng thái (P0) · màn hình đối soát unmatched xếp hạng ứng viên (P1) · payment driver interface từ v1, SePay đầu tiên (P0) · trang hướng dẫn kết nối provider từng bước (P0) · refund: request/checklist thủ công/đánh dấu hoàn tất → refunded (P0), double-match/overpayment tự tạo refund request (P0).

**E — CRM Leads & Sales:** danh sách lead filter/search/phân trang server-side (P0) · kanban pipeline cấu hình theo org qua dnd-kit (P0) · chi tiết lead + timeline activities (P0) · assignment gán tay/round-robin (P0) · quick actions gọi/Zalo/xác nhận thanh toán/kích hoạt (P0) · dedupe theo SĐT (P0) · export/import CSV (P1) · thông báo lead mới realtime+email digest (P1) · tags/saved views/bulk actions (P2).

**F — Prompt & Skills Manager:** CRUD Skill markdown platform/tenant scope, bật/tắt per-landing (P0) · skills nền tảng ship sẵn (seo-landing-vn, cwv-budget, copywriting, form-phễu-chuẩn) (P0) · CRUD Prompt template với biến+versioning (P0) · test bench so sánh version (P1) · marketplace skill (P2).

**G — Publishing & Domains:** publish 1-click subdomain, build+deploy immutable <30s (P0) · rollback/unpublish (P0) · deployment snapshot version (P0) · custom domain CNAME+cert (P1) · SEO tự động sitemap/robots/canonical/OG/JSON-LD (P0) · analytics first-party nhẹ (P1).

**H — AI Connections:** BYOK connect OpenRouter/Anthropic/OpenAI, OpenRouter ưu tiên onboarding (P0) · platform credits đo token (P0) · OpenRouter ngang hàng provider chính từ v1 (P0) · Sign in with Claude/ChatGPT nếu được duyệt (P2) · dùng thử N lần không cần API key qua Cloudflare Workers AI (P1).

**I — Email giao dịch (Resend):** xác thực email + invite (P0) · reset mật khẩu (P0) · digest lead mới (P1) · email xác nhận đơn hàng (P1) · domain gửi cô lập `mail.donve.vn`, không dùng `info@` cho tự động (P0).

## NFR nổi bật

Lighthouse ≥95 mobile, LCP<1.8s, JS≤10KB gzip, TTFB VN<100ms · dashboard TTI<3s · API p95<300ms, webhook SePay idempotent <2s · tenant isolation org_id + RLS + test chống leak · BYOK mã hoá AES-256-GCM, iframe sandbox+CSP, sanitize HTML · uptime 99.9% landing / 99.5% dashboard · i18n VN mặc định qua paraglide-js · Nghị định 13/2023 (PDPA VN): consent checkbox không tick sẵn, quyền xoá/xuất dữ liệu trong 72h, retention 12 tháng cho lead chưa paid, nền tảng = data processor · kiểm soát chi phí băng thông: asset content-hash cache immutable, alert traffic bất thường (không tự chặn); video giữ nguyên trên R2 v1, ngưỡng chuyển sang Bunny Stream khi ~5GB egress-tương-đương/tháng hoặc giật/buffer.
