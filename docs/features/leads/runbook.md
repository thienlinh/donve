# Lead Management — Runbook thiết kế toàn diện

Tài liệu này thiết kế lại toàn bộ luồng lead (capture → routing → làm việc → theo dõi) trên nền hiện có (`packages/db/src/schema/crm.ts`, `apps/api/src/modules/leads/routes.ts`, `apps/dashboard/src/features/leads/`). Không phải rebuild — hệ thống đã có schema `leads`/`leadActivities`/`consents`, RBAC scoped visibility, kanban dnd-kit, CSV import/export, SSE realtime. Runbook này lấp các khoảng trống: auto-routing, custom domain, đa nguồn lead, tracking theo role, UX polish.

Mỗi mục có: **Vấn đề** (tại sao cần) → **Thiết kế** → **Việc cần làm** (map vào file/package cụ thể). Đánh số phase ở mục 11 để biết làm trước-sau.

---

## 1. Kiến trúc tổng quan

```
┌─ Nguồn lead ─────────────────────────────────────────────┐
│ Landing page (subdomain/custom domain)                    │
│ Facebook Lead Ads (webhook)                                │
│ Zalo OA (webhook)                                           │
│ Nhập tay / CSV import                                        │
└───────────────┬─────────────────────────────────────────┘
                │  tất cả đổ vào 1 điểm vào duy nhất
                ▼
        findOrCreateLead()  (dedupe theo phone, giữ nguyên)
                │
                ▼
        Routing Engine (MỚI — §2)
        - áp assignmentRules của org
        - set assigneeId hoặc để "unassigned pool"
                │
                ▼
        leads + leadActivities (đã có)
                │
        ┌───────┼────────────┐
        ▼       ▼            ▼
   SSE realtime  Notify đa kênh   Event tracking (MỚI — §7)
   (đã có)       (MỚI — §8)       cho dashboard theo role
                │
                ▼
        Dashboard: Kanban / List / Detail (UX polish — §5)
```

Nguyên tắc xuyên suốt: **1 cổng vào (`findOrCreateLead`) cho mọi nguồn**, để routing/dedupe/consent chỉ viết 1 lần, không nhân bản logic theo từng kênh.

---

## 2. Auto-assignment & routing engine

**Vấn đề**: hiện tại `assigneeId` phải gán tay. RBAC scoping (`scopedAssigneeFilter`) chỉ ẩn/hiện đúng, không tự động phân việc — nếu không ai gán, lead nằm im trong "seeAllLeads" view và dễ bị bỏ sót.

**Thiết kế**:

Bảng mới `assignment_rules` (org-scoped, giống cách `organizations.settings.pipeline` đang override theo org):

| cột | ý nghĩa |
| --- | --- |
| `orgId` | FK |
| `priority` | thứ tự áp rule, rule đầu tiên match thì dừng |
| `matchCampaignId` / `matchPersona` | điều kiện áp (null = match tất cả) |
| `strategy` | `round_robin` \| `least_active_leads` \| `fixed_assignee` |
| `assigneePoolIds` | jsonb array user id tham gia chia việc |
| `slaHours` | sau bao lâu không có `leadActivities` mới thì tự động escalate |
| `onSlaBreach` | `reassign_next_in_pool` \| `notify_manager` |

Luồng khi lead mới tạo (trong `findOrCreateLead`, ngay sau insert):

1. Query `assignment_rules` theo `orgId`, order by `priority`, lấy rule đầu match campaign/persona.
2. `round_robin`: lưu con trỏ "người kế tiếp" (1 cột `lastAssignedIndex` trên rule hoặc dùng `assigneePoolIds[leadCountModPoolSize]` — không cần bảng counter riêng).
3. `least_active_leads`: `COUNT(leads WHERE assigneeId = X AND stage NOT IN (won, lost))` cho từng người trong pool, chọn nhỏ nhất — 1 query, không cần cache thêm.
4. Ghi `leadActivities` type `system` nội dung "Tự động gán cho {tên}" — tái dùng activity feed đã có, không cần bảng audit riêng.

SLA breach: 1 cron nhẹ (đã có worker/queue trong `packages/drivers`?) quét `leads` có `stage NOT IN (won,lost)` và `updatedAt` (hoặc activity mới nhất) quá `slaHours` → áp `onSlaBreach`.

**Việc cần làm**:

- `packages/db`: bảng `assignment_rules` mới trong `crm.ts`.
- `apps/api/src/modules/leads`: hàm `routeLead(lead, org)` gọi trong `findOrCreateLead`, endpoint CRUD `assignment_rules` (chỉ role admin/owner).
- Cron/queue job `sla-sweep` (tần suất 15-30 phút là đủ, không cần near-realtime).
- Dashboard: trang **Settings → Phân việc tự động** (form rule builder, kéo thả thứ tự priority — tái dùng dnd-kit sẵn có).

---

## 3. Custom domain (đa tenant)

**Vấn đề**: landing page trên domain riêng của khách phải submit lead đúng org, và `edge-router` hiện chỉ thấy xử lý theo subdomain.

**Thiết kế**:

Bảng `domains`: `orgId`, `hostname` (unique), `status` (`pending_dns` \| `verified` \| `failed`), `verificationToken`, `createdAt`. Xác thực bằng TXT record (`_donve-verify.<domain> = <token>`) — không cần khách đổi nameserver, chỉ thêm 1 TXT + 1 CNAME trỏ về edge-router.

SSL: dùng **Cloudflare for SaaS – Custom Hostnames** (đã dùng CF Worker cho edge-router, nên đây là lựa chọn tự nhiên, không cần tự quản cert). API tạo Custom Hostname khi khách submit domain, poll trạng thái, cập nhật `domains.status`.

Resolve org theo domain tại edge:

```
Request Host: cuahang123.com
  → KV lookup: domains:cuahang123.com → orgId + landingPageId
  → fallback (không có trong KV): 404, KHÔNG fallback về subdomain logic
    (tránh 1 domain lạ vô tình serve nhầm content org khác)
```

KV cache domain→org mapping (giống cách landing page hiện cache theo subdomain), invalidate khi domain xoá/đổi.

Form submit trên landing page dùng domain riêng: request tới `apps/api` phải mang theo `orgId` đã resolve ở edge (header nội bộ hoặc landing-runtime embed sẵn `data-org-id` lúc build/publish) — **không** resolve lại org từ `Origin` header ở API layer (không tin cậy, dễ giả mạo).

**Việc cần làm**:

- `packages/db`: bảng `domains`.
- `apps/edge-router`: route theo `domains` KV trước khi fallback subdomain; job đồng bộ CF Custom Hostname status.
- Dashboard: **Settings → Domains** — nhập domain, hiển thị TXT/CNAME cần thêm, trạng thái xác thực realtime (poll 10s hoặc SSE).
- `apps/landing-runtime`: đảm bảo bundle publish nhúng đúng `orgId`/`landingPageId` tĩnh, không phụ thuộc domain lúc chạy.

---

## 4. Đa nguồn lead (Facebook Lead Ads, Zalo OA)

**Vấn đề**: SME Việt Nam phần lớn có lead từ Facebook/Zalo, không chỉ landing page tự dựng.

**Thiết kế**: mỗi nguồn = 1 webhook nhỏ → map field → gọi `findOrCreateLead` giống hệt landing page, khác `source` field.

- Thêm cột `source` vào `leads` (`landing_page` \| `facebook` \| `zalo_oa` \| `manual` \| `csv_import`) — dùng để lọc/báo cáo, không tách bảng riêng.
- `POST /webhooks/facebook-leads`: verify signature (App Secret), map `field_data` → `fullName/phone/email/customFields`, set `utm.source = "facebook"`, campaign map qua `matchCampaignId` bằng Facebook Form ID lưu trong `campaigns.externalRefs` (jsonb, thêm nếu chưa có).
- `POST /webhooks/zalo-oa`: tương tự, verify theo Zalo OA signature.
- Settings UI: **Kết nối nguồn lead** — OAuth connect Facebook Page/Zalo OA, chọn Form/OA cần lắng nghe, map field custom nếu tên field phía FB/Zalo khác schema mình.

**Việc cần làm**: 2 webhook route mới trong `apps/api/src/modules/leads` (hoặc module riêng `integrations`), cột `source`, UI kết nối trong Settings.

---

## 5. UI/UX — Kanban & List (tối ưu thao tác)

Nền tảng đã đúng hướng (dnd-kit kanban có sẵn). Polish thêm, **không đổi lib**:

### 5.1 Responsive

- Desktop (≥1024px): kanban ngang, cột = stage, scroll ngang giữa các cột.
- Tablet/mobile (<1024px): kanban → **list nhóm theo stage** (accordion/sticky header per stage), vuốt trái/phải trên card đổi stage nhanh (thay vì kéo-thả khó dùng bằng ngón tay) — dùng `@dnd-kit` touch sensor có sẵn hoặc swipe action đơn giản hơn (2 nút ⬅➡ trên card ở mobile).

### 5.2 Bulk actions

- Checkbox chọn nhiều ở list view (không cần ở kanban — kéo-thả từng cái đã nhanh).
- Toolbar nổi khi có selection: đổi stage hàng loạt, gán hàng loạt, xoá/archive hàng loạt.

### 5.3 Saved / shared views

- Filter hiện có (`leads-filter-bar.tsx`) → thêm nút "Lưu view" (tên + filter state) lưu vào 1 bảng `saved_views` (`orgId`, `userId` null = shared toàn org, `filterJson`, `name`).
- Đồng bộ filter state lên URL query (nuqs — đã phù hợp stack Vite/React) để share link view qua chat/Zalo cho đồng nghiệp.

### 5.4 Trạng thái dễ nhận biết

- Badge tuổi lead trên card ("2 giờ", "3 ngày" — đổi màu cam/đỏ khi gần/quá SLA từ §2).
- Avatar assignee trên card kanban (đang chỉ thấy tên trong sheet chi tiết, nên lộ ngay trên card).
- Card có unread indicator khi có activity mới mà sales chưa xem (dùng `leadActivities.createdAt` so với `leads.lastViewedAt` — thêm cột nhỏ).

### 5.5 Wireframe list view (desktop)

```
┌ Leads ───────────────────────────────────────────────────────────┐
│ [Kanban|List▾]  🔍 Tìm...   [Stage▾][Assignee▾][Nguồn▾][Lưu view]│
├────────────────────────────────────────────────────────────────┤
│ ☐ Tên       SĐT        Stage      Assignee   Nguồn    Tuổi       │
│ ☐ Nguyễn A  09xx        Mới        (chưa gán) FB Ads    2h        │
│ ☐ Trần B    09xx        Liên hệ    Sales 1    Landing  1 ngày 🔴 │
├────────────────────────────────────────────────────────────────┤
│ [2 đã chọn] [Đổi stage▾] [Gán cho▾] [Xuất CSV] [Xoá]              │
└────────────────────────────────────────────────────────────────┘
```

**Việc cần làm**: `apps/dashboard/src/features/leads/` — thêm `leads-list-view.tsx` (bulk toolbar), `saved-views` API+UI nhỏ, cột `lastViewedAt`/`source` trong lead card.

---

## 6. Export & tích hợp Google Sheets

**Vấn đề**: CSV export đã có (đủ cho hầu hết nhu cầu). "Đồng bộ Google Sheet riêng của từng assignee" là 2-way sync — chi phí kỹ thuật (OAuth per-user, xử lý conflict ghi đè) cao so với lợi ích.

**Khuyến nghị (lười đúng chỗ)**: không làm 2-way sync. Thay bằng:

- **Export theo lịch**: mỗi assignee tự bật "Gửi CSV leads của tôi mỗi sáng 8h qua email" — tái dùng route `/export` đã có + cron gửi mail, không cần Google API.
- Nếu thực sự cần Sheets (đối tác cần "sống" trong Sheet quen thuộc): 1-way, **Sheets đọc từ API** qua Google Apps Script `IMPORTDATA`/custom function gọi `/export` bằng API key cá nhân của assignee — không cần mình giữ Google OAuth token, đẩy trách nhiệm auth sang phía Sheet.

Chỉ build 2-way OAuth Sheets sync nếu có khách hàng cụ thể yêu cầu và trả tiền cho nó — đây là tính năng dễ over-engineer cho nhu cầu chưa xác nhận.

---

## 7. Tracking & dashboard theo role

**Vấn đề**: chỉ có `utm` lúc submit, không có visitor-level event, không có báo cáo scoped theo role.

**Thiết kế**:

- Bảng `landing_events` nhẹ: `orgId`, `landingPageId`, `type` (`page_view`\|`form_start`\|`form_submit`), `utm` jsonb, `sessionId`, `createdAt`. Ghi từ `apps/landing-runtime` (đã có script chạy trên landing) qua 1 endpoint beacon nhẹ (`apps/edge-router` đã có "event beacon" theo tech-stack.md §3 — tận dụng, không tạo hệ thống mới).
- Conversion rate = `form_submit / page_view` theo campaign — tính lúc query, không cần bảng aggregate riêng ở quy mô hiện tại.
- Dashboard scoped theo role (dùng permission có sẵn trong `packages/auth`):
  - `sales`: leads của tôi — số lượng theo stage, tỉ lệ chuyển đổi, thời gian phản hồi trung bình.
  - `admin/owner`: toàn org — theo campaign, theo nguồn (`source` §4), theo từng sales (leaderboard nhẹ, không phải để "chấm điểm" mà để phát hiện nghẽn).

**Việc cần làm**: bảng `landing_events`, endpoint beacon (nếu edge-router chưa có sẵn thì thêm), `apps/dashboard/src/features/analytics` (mới hoặc mở rộng `campaign-analytics-dialog.tsx` hiện có) với query scoped theo role.

---

## 8. Thông báo đa kênh

**Vấn đề**: chỉ có SSE bell trong app — sales ngoài field không thấy ngay.

**Thiết kế**: `packages/drivers` đã có abstraction cho notification/queue theo tech-stack — thêm 1 driver Zalo ZNS hoặc SMS (tùy ngân sách khách), giữ interface chung `notify(userId, message, channel)`.

- Trigger: lead mới được auto-gán (§2), SLA sắp/đã breach.
- Người dùng tự chọn kênh nhận (in-app / email / Zalo) trong Settings cá nhân — không ép 1 kênh, tránh spam.

**Việc cần làm**: driver mới trong `packages/drivers` theo interface có sẵn, gọi từ `routeLead()`/SLA sweep (§2), UI chọn kênh trong user settings.

---

## 9. Trùng lặp & ưu tiên lead

- **Merge trùng**: dedupe hiện theo `phone` là đúng hướng cho hầu hết case; thêm nút thủ công "Merge với lead khác" trong detail sheet khi sales tự phát hiện trùng (đổi số/nhập sai) — không cần thuật toán fuzzy-match tự động (over-engineering cho quy mô hiện tại, dễ merge nhầm).
- **Lead scoring**: bắt đầu đơn giản — badge "🔥 Nóng" nếu `source` là nguồn có conversion rate cao lịch sử + `form_submit` gần đây trong khung giờ hành chính. Không cần ML scoring ở giai đoạn này.

---

## 10. Rủi ro & đánh đổi cần quyết định trước khi code

| Quyết định | Đánh đổi |
| --- | --- |
| Round-robin đơn giản vs. gán theo năng lực (skill-based) | Round-robin dễ làm, đủ tốt cho hầu hết SME. Skill-based cần thêm taxonomy "kỹ năng" — chỉ làm nếu khách hàng cụ thể cần. |
| Custom domain qua CF for SaaS vs. tự quản Let's Encrypt | CF for SaaS nhanh, đỡ vận hành cert, nhưng có chi phí theo hostname — cân nhắc nếu số lượng khách dùng custom domain lớn. |
| Google Sheets 1-way (Apps Script pull) vs. 2-way OAuth sync | 1-way rẻ, đủ dùng. Chỉ nâng cấp lên 2-way khi có khách trả tiền cho nó. |
| Event tracking mới (`landing_events`) có tăng tải ghi DB đáng kể khi traffic cao | Cân nhắc ghi qua queue/batch thay vì insert trực tiếp mỗi page view nếu traffic landing lớn. |

---

## 11. Thứ tự triển khai đề xuất

**Phase 1 — nền tảng còn thiếu, tác động nhiều nhất, rủi ro thấp**

1. `source` column + 2 webhook Facebook/Zalo (§4) — mở rộng nguồn lead ngay, tái dùng `findOrCreateLead`.
2. Auto-assignment round-robin cơ bản (§2, chưa cần SLA escalation) — giải quyết đúng câu hỏi gốc "SEO 1/SEO 2".
3. UX polish list view + bulk actions + badge tuổi lead (§5.2, 5.4) — chi phí thấp, cải thiện thao tác hàng ngày ngay.

**Phase 2 — mở rộng kênh & multi-tenant** 4. Custom domain (§3) — cần nếu đang bán gói "domain riêng" cho khách. 5. SLA escalation + notify đa kênh (§2 SLA, §8). 6. Saved views (§5.3).

**Phase 3 — insight sâu** 7. Event tracking + dashboard theo role (§7). 8. Merge thủ công + badge lead nóng (§9). 9. Google Sheets export theo lịch (§6) — chỉ nếu khách yêu cầu.

Không làm Phase 2/3 trước Phase 1 — Phase 1 sửa đúng vấn đề "lead bị bỏ sót/rơi vào sai người" mà bạn đặt câu hỏi ban đầu; phần còn lại là mở rộng, không phải sửa lỗi cấu trúc.
