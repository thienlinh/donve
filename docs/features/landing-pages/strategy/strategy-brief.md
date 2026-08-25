# Strategy Brief

## Business Knowledge Graph

Entity `businessProfiles`, persistent theo project — không đọc lại từ đầu mỗi lần generate/edit.

```text
PRODUCT: category, features, benefits, differentiators, pricing, integrations
CUSTOMER: ICP, industry, job title, pain points, goals, objections, buying triggers
MARKET: competitors, alternatives, positioning hiện tại, category language
```

Nguồn: business brief nhập tay, URL website hiện có, PDF/tài liệu sản phẩm, brand guideline, testimonial, URL đối thủ, ảnh chụp sản phẩm. Research Agent trích xuất, gắn nhãn **fact (có nguồn) / inference (AI suy luận) / unknown (cần hỏi thêm)** — 3 loại này không trộn lẫn khi hiển thị cho user.

## Strategy Brief — entity `strategyBriefs`

### Business

product, category, business model, pricing, margin/LTV notes, geographic scope

### Customer

ICP, buyer role, user role, awareness level, jobs-to-be-done, pain points, desired outcomes, objections, triggers

### Market

category language, alternatives, competitors, differentiators, proof availability

### Funnel

traffic source, awareness stage, intent level, conversion goal, conversion window, qualification rules

### Offer

core offer, bonuses, guarantee, pricing, urgency/scarcity policy, risk reversal

### Message

one-line value proposition, core promise, 3-5 supporting claims (mỗi claim gắn `evidenceRef` trỏ tới nguồn thật — testimonial, số liệu, tài liệu import; không để trống khi generate proof section), objection handling, primary CTA, secondary CTA

## Traffic-specific strategy

| Nguồn traffic | Chiến lược |
| --- | --- |
| Paid search | Tối ưu theo keyword intent, message match, conversion path nhanh |
| Paid social | Pain → outcome → differentiation → credibility → hành động ít ma sát |
| Organic search | Search intent coverage, chiều sâu chủ đề, trust, internal link, thông tin hữu ích trước CTA |
| Retargeting | Proof mạnh, objection, case study, so sánh, giá rõ ràng, giảm ma sát |

## Page architecture decision rule

Section chỉ tồn tại nếu phục vụ 1 trong: **understanding, desire, proof, risk reduction, action**. Đây là ràng buộc Page Architect Agent áp dụng khi chọn component (`ai/agent-pipeline.md`).

## Default conversion sequence

Clarity → Relevance → Value → Proof → Objection handling → Offer → CTA

## Anti-pattern (Quality Agent kiểm tra các mục này)

Headline mơ hồ · claim "all-in-one" không kèm proof · feature dump trước khi frame vấn đề · nhiều CTA cùng trọng lượng thị giác · testimonial không danh tính/ngữ cảnh · urgency giả · giá thay đổi không giải thích · form dài không progressive qualification · thiết kế chạy theo novelty thay vì hierarchy.

## Xác nhận

Strategy Brief AI đề xuất luôn cần user xác nhận/sửa trước khi Page Architect chạy. Field `confirmedAt`/`confirmedBy` bắt buộc có trước khi transition sang `PAGE_PLAN_READY` (state machine — `ai/agent-pipeline.md`).
