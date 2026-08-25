# Product Vision

## Positioning

Nền tảng AI-native biến business context thành landing page chất lượng cao, đo lường được, hướng chuyển đổi — và tiếp tục tối ưu từ traffic thật. Chất lượng ổn định vì trang được lắp ráp từ một Component Library thiết kế đúng một lần, không phải LLM tự vẽ layout mỗi lần.

## North-star metric

**Qualified Conversion Rate (QCR)**: tỷ lệ visitor hoàn thành conversion event chính VÀ đạt tiêu chí chất lượng cấu hình (lead có SĐT hợp lệ, đơn hàng thanh toán thành công...) — không phải form-submit thô.

## Năng lực nền tảng

### Business & Strategy Intelligence

Business Knowledge Graph persistent theo project. Strategy Brief có cấu trúc (ICP, positioning, message hierarchy, conversion goal), xác nhận/sửa tay đầy đủ. Traffic-specific strategy theo nguồn traffic.

### Component Library & Page Architecture

~27 component gốc, mỗi component có content schema kiểu, a11y/responsive/tracking contract cố định. Page Architect chọn component có lý do rõ (purpose: understanding/desire/proof/risk_reduction/action).

### Content Generation

Điền content theo schema từng component, song song per-section, model routing theo độ khó task.

### Visual Editing

Canvas React thật (`@puckeditor/core`, không phải `@json-render/react` — xem `README.md` §Cập nhật kiến trúc), Inspector là typed prop editor theo đúng component, panel "Add section" cho thao tác thủ công hoàn toàn không cần AI.

### Quality System

3 tầng: schema validation (tức thời) → component-level test (1 lần, hưởng lợi mọi trang dùng component đó) → page-level audit (strategy/copy/structure/SEO/performance/tracking/token/visual regression). Có ngưỡng publish.

### Tracking & Analytics

Tracking deterministic 100% theo component đã chọn. Identity/attribution/conversion-hierarchy layer chuẩn. Offline conversion loop (lead → MQL → customer → revenue).

### Publishing

Edge-native: R2 + KV + Cache API + outbox pattern, rollback tức thời, custom domain, sitemap/robots/OG/JSON-LD.

### Optimization Loop

Optimization Agent đọc analytics + audit history, đề xuất hypothesis có căn cứ, cần approval người dùng, không tự publish.

## ICP

Chính: SaaS founder/growth team, doanh nghiệp dịch vụ B2B, agency làm nhiều landing cho client, product/performance marketing team. Phụ: ecommerce brand, personal brand/creator, dịch vụ địa phương.

## Jobs-to-be-done

"Khi tôi có sản phẩm và đối tượng mục tiêu, giúp tôi ra mắt landing page đáng tin cậy nhanh, chứng minh nó đo lường được, và cải thiện conversion mà không cần một đội growth đầy đủ."

## Product principles

1. AI không thiết kế layout — AI chọn, điền, tinh chỉnh trên hệ thống đã thiết kế đúng.
2. Structured business data trước khi có 1 component nào được chọn.
3. Mọi patch là thao tác có kiểu trên schema — không thể tạo ra output hỏng.
4. Mọi tương tác quan trọng đo lường được, deterministic.
5. Mọi artifact AI sinh ra audit được ở đúng tầng chịu trách nhiệm.
6. Fact/inference/unknown tách bạch rõ trong mọi output AI.
7. Ít component chất lượng cao hơn nhiều component tầm thường.
8. Tenant luôn export được HTML sạch, không khoá vào nền tảng.
9. Sửa 1 lỗi chất lượng ở component = sửa cho mọi trang dùng nó, có version pin + recompile chủ động.
