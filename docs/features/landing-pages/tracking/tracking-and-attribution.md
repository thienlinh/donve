# Tracking & Attribution

## Nguyên tắc

Mỗi `componentId` trong Component Library mang sẵn `trackingEvents` cố định trong catalog — `lead_form` luôn emit `form_started`+`form_submitted`, `cta_banner` luôn emit `cta_clicked`. Khi Page Architect chọn 1 component cho 1 element, tracking của element đó đã quyết định xong — không cần suy luận thêm, chỉ gắn đúng element id vào registry.

Hạ tầng nhận event: `events` table (append-only, ghi từ beacon `/e/*` trên `edge-router`).

## Layers

Identity → Attribution → Behavioral event → Conversion → Experiment → Revenue/quality → Privacy/consent

## Identity

`anonymous_id` (cookie/localStorage first-party, set bởi `landing-runtime`), `session_id`, `visitor_id` (cấp platform), `user_id` (khi tenant có auth trên landing), `account_id = orgId` (B2B), `page_id`, `page_version_id`.

Không gửi PII không cần thiết. Email chỉ hash khi có lý do business/privacy rõ ràng.

## Attribution fields

`utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid` (hoặc click id nền tảng khác), `landing_page, referrer, referrer_domain, entry_timestamp, device_type`, vùng địa lý mức thô. Capture first-touch và last-touch riêng biệt.

## Conversion hierarchy

```text
page_view → cta_click → form_submit → lead_created → mql_created → opportunity_created → customer_created → revenue_recorded
```

Offline conversion loop: khi lead chuyển trạng thái (qualified/opportunity/customer) trong CRM, ghi ngược 1 event vào `events` — cho phép Optimization Agent tối ưu theo chất lượng lead, không phải form-submit thô.

## Event naming — `object_action`

`page_viewed, section_viewed, cta_clicked, form_started, form_submitted, lead_created, pricing_viewed, faq_opened, outbound_link_clicked`.

## Event contract

```text
event_name, event_version, anonymous_id, session_id, user_id?, timestamp,
page_id, page_version_id, source/medium/campaign?, properties{}
```

## Event registry — `eventDefinitions`

Sinh tự động ngay khi Page Architect chốt `PageSpec` — mỗi `componentId` đã chọn ghi thẳng `trackingEvents` cố định vào `eventDefinitions` (`eventName, elementId, componentId, requiredProperties[]`). Quality Agent so khớp element id có tồn tại thật trong rendered HTML.

## UTM governance

```text
source=google|meta|linkedin|newsletter
medium=cpc|paid_social|email|organic
campaign=<initiative>_<month>_<market>
content=<creative_or_message_variant>
term=<keyword>
```

Beacon từ chối UTM sai format trước khi ghi vào `events`. Không suy ra campaign từ referrer.

## Quality gates

Mọi CTA chính có event trong `eventDefinitions` · mọi form có cả `form_started` và `form_submitted` · SPA navigation không tính trùng page_view · consent state kiểm tra trước khi gửi tracking không thiết yếu · staging dùng `page_version_id`/`org_id` riêng.
