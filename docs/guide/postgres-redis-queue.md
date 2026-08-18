# Guide: Postgres, Redis, Queue — học & tham chiếu hàng ngày

File này khác `docs/runbooks/database.md`: runbook là **thao tác cụ thể trong project này** (lệnh gì, file nào). File này là **kiến thức nền + ví dụ khi nào dùng cái gì**, viết để đọc lại nhiều lần và mang sang project khác vẫn dùng được. Khi câu hỏi là "làm sao chạy migrate trong project này" → đọc runbook. Khi câu hỏi là "tại sao cần index / khi nào dùng Redis / queue khác gì cache" → đọc file này.

---

## 1. Postgres — nền tảng

### 1.1 Table, row, column — không có gì lạ

Một bảng (`table`) giống 1 sheet Excel: mỗi hàng (`row`) là 1 bản ghi, mỗi cột (`column`) có kiểu dữ liệu cố định (text, int, boolean, timestamp, jsonb...).

```sql
select id, email, created_at from users where org_id = 'abc123' order by created_at desc limit 20;
```

Đọc câu này: lấy 3 cột, từ bảng `users`, lọc theo `org_id`, sắp xếp mới nhất trước, chỉ lấy 20 hàng.

### 1.2 Index — tại sao query nhanh hay chậm

Không có index, Postgres phải quét **toàn bộ bảng** (sequential scan) để tìm hàng khớp điều kiện WHERE. Có index trên cột đó, nó tra như tra mục lục sách — nhảy thẳng tới vị trí.

**Khi nào cần thêm index:**

- Cột thường xuất hiện trong `WHERE`, `JOIN ON`, `ORDER BY` của query chạy thường xuyên.
- Bảng có nhiều hàng (vài nghìn trở lên) — bảng nhỏ thì sequential scan cũng đủ nhanh, thêm index chỉ tốn công ghi.

**Khi nào KHÔNG nên thêm bừa:**

- Mỗi index làm `INSERT`/`UPDATE` chậm hơn 1 chút (phải cập nhật cả index) và tốn dung lượng — đừng đánh index "cho chắc" trên cột ít khi query.
- Cột có rất ít giá trị khác nhau (ví dụ `boolean`, `status` chỉ có 3 giá trị) thường không hưởng lợi nhiều từ index thường (dùng partial index nếu cần).

**Cách kiểm tra query có dùng index không** (công cụ quan trọng nhất khi debug query chậm):

```sql
explain analyze select * from leads where org_id = 'abc123' and phone = '0901234567';
```

Nếu thấy `Seq Scan` trong output → không dùng index, bảng lớn thì đây là chỗ cần thêm index. Nếu thấy `Index Scan` → đã tối ưu.

### 1.3 Transaction — "tất cả hoặc không gì cả"

Transaction gom nhiều câu lệnh thành 1 khối atomic: nếu 1 lệnh lỗi giữa chừng, toàn bộ rollback, không để dữ liệu ở trạng thái nửa vời.

**Ví dụ kinh điển cần transaction:** trừ credit của org A và cộng usage log — nếu chỉ trừ credit mà ghi log thất bại, dữ liệu sai lệch vĩnh viễn.

```sql
begin;
update orgs set credits = credits - 10 where id = 'org_1';
insert into usage_logs (org_id, amount) values ('org_1', 10);
commit;
```

Nếu dòng `insert` lỗi, `update` phía trên cũng bị hủy khi chạy trong cùng transaction.

**Lưu ý riêng khi chạy trên driver HTTP (kiểu Neon serverless/CF Workers)**: không phải driver nào cũng có transaction thật — một số chỉ có `.batch()` (nhiều lệnh gộp 1 round-trip nhưng không cùng cơ chế rollback như transaction thật). Xem `docs/runbooks/database.md` mục 5 để biết cách project này xử lý khác biệt 2 driver.

### 1.4 N+1 query — lỗi hiệu năng hay gặp nhất

Sai:

```
lấy danh sách 50 leads
for mỗi lead: query thêm 1 lần để lấy tên campaign
→ 51 query
```

Đúng — gộp lại bằng JOIN, chỉ 1 query:

```sql
select leads.*, campaigns.name as campaign_name
from leads
join campaigns on campaigns.id = leads.campaign_id
where leads.org_id = 'org_1';
```

Dấu hiệu nhận biết N+1: số lượng query tăng tuyến tính theo số item trả về. Nếu dùng ORM (Drizzle, Prisma...), để ý các đoạn code query trong vòng lặp `for`/`.map()` — gần như luôn là dấu hiệu N+1.

### 1.5 Connection pool vs serverless HTTP driver

- **Connection pool** (dùng khi backend chạy dài hạn — VPS, container): mở sẵn N kết nối tới DB, tái sử dụng qua nhiều request, tránh chi phí mở/đóng kết nối liên tục (mỗi lần mở kết nối TCP + TLS handshake với Postgres khá tốn).
- **Serverless HTTP driver** (Neon HTTP, dùng khi backend chạy trên edge/CF Workers): mỗi query là 1 HTTP request riêng biệt, không giữ kết nối TCP mở — phù hợp môi trường serverless vì không thể giữ connection pool sống giữa các lần cold-start, nhưng đổi lại: chậm hơn 1 chút mỗi query, và không có transaction thật (xem 1.3).

Project này dùng cả 2 tuỳ runtime — xem `packages/db/src/client/` và `docs/runbooks/database.md` mục 1.

### 1.6 Row-Level Security (RLS) — khi nhiều "khách hàng" dùng chung 1 DB

RLS là tính năng của Postgres: gắn policy vào bảng, Postgres tự lọc hàng theo điều kiện đó ở **tầng database**, không phụ thuộc code có nhớ thêm `WHERE org_id = ...` hay không. Dùng khi xây multi-tenant SaaS (nhiều tổ chức/khách hàng share 1 DB).

Đây không phải kiến thức "phổ thông" mọi dev cần biết ngay, nhưng nếu bạn làm SaaS B2B thì sớm muộn cũng gặp — chi tiết cách project này áp dụng ở `docs/runbooks/database.md` mục 5 và `docs/architecture/architecture.md` §6.

---

## 2. Redis — cache, rate limit, pub/sub

Redis là kho lưu trữ **key-value trong RAM**, cực nhanh (đọc/ghi tính bằng mili-giây), nhưng **không phải chỗ lưu dữ liệu quan trọng lâu dài** — nó tồn tại để tăng tốc, không thay thế Postgres.

### 2.1 Khi nào dùng Redis (3 trường hợp phổ biến nhất)

**a) Cache — tránh query DB lặp lại cho data ít đổi**

```ts
// pattern: cache-aside — check cache trước, miss thì query DB rồi ghi lại cache
async function getOrgSettings(orgId: string) {
  const cached = await cache.get<OrgSettings>(`org:${orgId}:settings`);
  if (cached) return cached;

  const settings = await db.query...; // query Postgres thật
  await cache.set(`org:${orgId}:settings`, settings, { ttlSeconds: 300 });
  return settings;
}
```

Dùng khi: data được đọc nhiều hơn ghi rất nhiều lần (config, settings, kết quả tính toán tốn kém), và **chấp nhận được** việc data có thể cũ vài giây/phút (TTL).

Không dùng khi: data cần chính xác tuyệt đối tại mọi thời điểm (số dư tài khoản, tồn kho) trừ khi bạn xử lý invalidation rất cẩn thận.

**Cạm bẫy lớn nhất của cache: quên invalidate.** Nếu update DB mà không xoá/update cache tương ứng, user sẽ thấy data cũ. Luôn tự hỏi: "khi nào cache này cần bị xoá?" trước khi thêm cache.

**b) Rate limiting — chặn spam request**

```ts
// sliding window đơn giản bằng incr + expire
async function checkRateLimit(ip: string, limit = 10, windowSeconds = 60) {
  const key = `ratelimit:${ip}`;
  const count = await cache.incr(key, { ttlSeconds: windowSeconds });
  return count <= limit;
}
```

Dùng cho endpoint public (form submit, webhook, login) để chặn brute-force/spam. Redis phù hợp vì `INCR` là atomic (không lo 2 request cùng lúc đọc-sửa-ghi bị race condition) và cực nhanh.

**c) Pub/Sub — báo real-time giữa các process**

Một process `publish` message vào 1 channel, các process khác đang `subscribe` channel đó nhận ngay lập tức. Dùng khi cần đẩy update real-time (ví dụ: dashboard hiện trạng thái "đang xử lý" của 1 job ngay khi job đó xong, không cần polling liên tục).

```ts
await realtime.publish(`org:${orgId}:jobs`, { jobId, status: "done" });
// phía dashboard subscribe channel này, nhận event ngay khi có publish
```

### 2.2 Redis HTTP (Upstash) vs Redis TCP truyền thống (ioredis)

|  | Upstash (HTTP) | ioredis (TCP) |
| --- | --- | --- |
| Kết nối | Mỗi lệnh = 1 HTTP request | Giữ 1 kết nối TCP mở liên tục |
| Phù hợp runtime | Serverless/edge (CF Workers) — không giữ được connection sống giữa các request | Server chạy dài hạn (VPS, container) |
| Độ trễ | Cao hơn 1 chút (overhead HTTP) | Thấp hơn |
| Pub/Sub | Hỗ trợ nhưng qua polling ẩn dưới HTTP | Native, real-time thật |

Quy tắc chọn: **chạy trên edge/serverless → Upstash HTTP. Chạy trên server dài hạn (VPS) → ioredis TCP.** Project này dùng Upstash ở phase CF Workers, dự tính chuyển sang ioredis khi có phase VPS — xem `packages/drivers/src/cache/upstash.ts` và `docs/architecture/tech-stack.md`.

### 2.3 Việc KHÔNG nên làm với Redis

- Không coi Redis là nguồn sự thật duy nhất (source of truth) cho data quan trọng — RAM có thể mất khi restart/crash (trừ khi bật persistence, và ngay cả vậy vẫn không nên).
- Không cache data mà không đặt TTL — key sống mãi mãi = rò rỉ bộ nhớ dần theo thời gian.
- Không dùng key trùng lặp/không có namespace rõ ràng — luôn prefix theo domain (`org:<id>:settings`, `ratelimit:<ip>`) để dễ debug và tránh đè nhau.

---

## 3. Queue / Background jobs — QStash, BullMQ

### 3.1 Tại sao cần queue thay vì xử lý ngay trong request

Nếu 1 request HTTP phải chờ gửi email + gọi AI API + ghi log xong mới trả response, user phải đợi lâu, và nếu 1 bước giữa chừng lỗi thì toàn bộ request fail dù phần chính (ví dụ "tạo lead thành công") đã xong.

**Pattern chuẩn:** request chỉ làm việc chính + enqueue 1 job cho phần chậm/không quan trọng bằng response ngay lập tức → trả response nhanh → job chạy nền, có retry riêng nếu lỗi.

```ts
// trong request handler — không await việc gửi email trực tiếp
await leadsRepository.insert(lead);
await jobs.enqueue({
  queue: "send-welcome-email",
  payload: { leadId: lead.id }
});
return c.json({ ok: true }); // trả response ngay, không đợi email
```

### 3.2 Push-based (QStash) vs Pull-based (BullMQ)

- **Push-based (QStash)**: bạn enqueue job, QStash tự **gọi ngược lại 1 HTTP endpoint** của bạn khi tới lúc chạy job đó (giống webhook). Không cần chạy worker process riêng — hợp với serverless/CF Workers vì không có gì "luôn chạy" để lắng nghe queue.
- **Pull-based (BullMQ)**: cần 1 worker process **luôn chạy** (long-running), liên tục hỏi Redis "có job nào chưa" và tự lấy ra xử lý. Hợp với VPS/container vì ở đó bạn có process chạy 24/7.

Project này dùng QStash ở phase CF Workers hiện tại; BullMQ dự kiến dùng khi có phase VPS (worker riêng biệt) — 2 driver cùng implement 1 interface `JobsDriver` để code nghiệp vụ (queue handler) không đổi khi chuyển hạ tầng, xem `packages/drivers/src/jobs/types.ts`.

### 3.3 Idempotency & dedupe — điều bắt buộc phải hiểu khi dùng queue

Queue **không đảm bảo job chỉ chạy đúng 1 lần** — do retry khi lỗi mạng/timeout, cùng 1 job có thể được gọi lại 2 lần. Nếu job đó là "trừ tiền" hay "gửi email", chạy 2 lần là bug nghiêm trọng.

Cách xử lý: dùng `dedupeId` (khoá duy nhất cho 1 lần "ý định" enqueue, ví dụ `orderId`) để driver tự bỏ qua job trùng trong 1 khoảng thời gian, hoặc tự kiểm tra ở phía xử lý job ("email này đã gửi cho leadId X chưa?") trước khi thực thi.

```ts
await jobs.enqueue({
  queue: "charge-invoice",
  payload: { invoiceId },
  dedupeId: invoiceId // cùng invoiceId gọi enqueue nhiều lần chỉ chạy 1 lần
});
```

### 3.4 Retry & delay

Job có thể lỗi tạm thời (API bên thứ 3 down 1 phút). Queue tốt sẽ tự retry theo backoff (đợi lâu dần giữa mỗi lần retry) thay vì retry liên tục làm quá tải bên nhận. Cả QStash và BullMQ đều hỗ trợ sẵn — không tự viết retry loop tay.

`delaySeconds`/`schedule` (cron) dùng khi job cần chạy sau 1 khoảng, hoặc chạy định kỳ (ví dụ: dọn dữ liệu hết hạn mỗi ngày lúc 3h sáng) thay vì chạy ngay.

### 3.5 Việc KHÔNG nên làm với queue

- Không enqueue job rồi giả định nó chạy ngay lập tức — luôn có độ trễ (network, cold start worker).
- Không viết job xử lý "không idempotent" (chạy 2 lần cho kết quả khác chạy 1 lần) mà không có cơ chế dedupe/check trạng thái trước.
- Không nhét quá nhiều logic nghiệp vụ phức tạp vào 1 job — job nên làm 1 việc rõ ràng, dễ retry toàn bộ nếu lỗi giữa chừng.

---

## 4. Bảng quyết định nhanh: dùng cái gì khi nào

| Nhu cầu | Dùng gì | Vì sao |
| --- | --- | --- |
| Lưu dữ liệu nghiệp vụ chính, cần chính xác | Postgres | Nguồn sự thật duy nhất, có transaction, ACID |
| Query lặp lại nhiều lần, data ít đổi | Redis (cache-aside) | Đọc RAM nhanh hơn query DB hàng chục-hàng trăm lần |
| Chặn spam/brute-force endpoint public | Redis (incr + expire) | Atomic counter, cực nhanh |
| Báo real-time giữa các process/tab | Redis Pub/Sub hoặc SSE hub | Không cần polling liên tục |
| Việc chậm/không cần chờ ngay trong request (email, AI call, webhook xử lý) | Queue (QStash/BullMQ) | Trả response nhanh, có retry độc lập |
| Việc cần chạy định kỳ (cron) | Queue có `schedule` | Không tự viết cron loop tay |
| Việc cần atomic nhiều bước liên quan tiền/số liệu | Postgres transaction | Rollback toàn bộ nếu 1 bước lỗi |

---

## 5. Thuật ngữ mở rộng (Redis & Queue)

| Thuật ngữ | Nghĩa |
| --- | --- |
| **TTL (Time To Live)** | Thời gian 1 key tồn tại trước khi tự xoá. |
| **Cache invalidation** | Xoá/cập nhật cache khi data gốc thay đổi, để tránh cache trả data cũ. |
| **Cache-aside** | Pattern: đọc cache trước, miss thì đọc nguồn thật rồi ghi lại cache. |
| **Race condition** | Lỗi xảy ra khi 2 tiến trình cùng đọc-sửa-ghi 1 dữ liệu không đồng bộ, dẫn tới kết quả sai. |
| **Atomic operation** | Thao tác đảm bảo không bị chen ngang giữa chừng (ví dụ Redis `INCR`). |
| **Pub/Sub** | 1 bên publish message vào channel, nhiều bên subscribe cùng channel nhận được ngay. |
| **Worker** | Process chạy nền, liên tục lấy job từ queue ra xử lý (dùng trong pull-based queue). |
| **Push-based vs pull-based queue** | Push: hệ thống queue tự gọi bạn khi tới lúc chạy job. Pull: worker của bạn tự hỏi queue "có job không". |
| **Idempotent** | Chạy nhiều lần cho kết quả giống hệt chạy 1 lần — bắt buộc với job có thể bị retry. |
| **Dedupe (deduplication)** | Loại bỏ các lần gọi trùng lặp (cùng 1 khoá) trong 1 khoảng thời gian. |
| **Backoff (retry backoff)** | Chiến lược đợi lâu dần giữa mỗi lần retry, tránh làm quá tải bên nhận. |
| **Sliding window (rate limit)** | Kỹ thuật đếm số request trong 1 khoảng thời gian trượt liên tục, để giới hạn tần suất. |
| **Cold start** | Độ trễ khởi động lần đầu của môi trường serverless khi chưa có instance nào đang chạy sẵn. |

---

## 6. Tài liệu liên quan trong repo

- `docs/runbooks/database.md` — thao tác Postgres cụ thể trong project này (migration, RLS, repository).
- `docs/architecture/database-schema.md` — schema đầy đủ + lý do thiết kế.
- `docs/architecture/architecture.md` §6 — lý do multi-tenancy/RLS, §4 — tổng quan hạ tầng (Upstash, QStash).
- `docs/architecture/tech-stack.md` — lý do chọn từng package (Upstash, BullMQ, ioredis) và mốc chuyển phase VPS.
- `packages/drivers/src/{cache,jobs,realtime}/` — interface + implementation thật, đọc khi cần biết chính xác API đang có sẵn.
