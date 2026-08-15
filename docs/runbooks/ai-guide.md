# Hướng dẫn prompt để Claude Code tự detect đúng

Mục tiêu: giúp bạn gõ prompt sao cho Claude Code tự chọn đúng **rule**,
**skill**, hoặc **agent** (`.claude/agents/*.md`) mà không cần gọi tên cụ
thể (`/skill-name`, "dùng agent X").

## Cơ chế detect (tóm tắt)

- **Rules** (`.claude/rules/*.md`) luôn được nạp sẵn mỗi phiên — không cần
  prompt gì đặc biệt, chúng luôn có hiệu lực.
- **Skills** được chọn bằng cách so khớp yêu cầu của bạn với `description`
  của từng skill. Prompt càng dùng đúng từ khóa trong domain của skill,
  càng dễ khớp.
- **Agents** (`.claude/agents/*.md`) được chọn khi việc bạn mô tả khớp cả
  *loại công việc* lẫn *quy mô* ghi trong `description` của agent đó. Việc
  nhỏ, rõ ràng → Claude tự làm thẳng, không vòng qua agent.

Nếu mô tả của bạn mơ hồ hoặc không có từ khóa đặc trưng, Claude có thể chọn
sai hoặc bỏ sót — phần dưới đây liệt kê theo từng tình huống thực tế của
repo này.

## Theo tình huống

| Tình huống | Gõ prompt như thế nào | Sẽ tự động dùng |
|---|---|---|
| Tạo package/app mới trong monorepo | "Tạo package mới `packages/xyz` cho ..." / "add a new app under apps/" | skill `add-package` |
| Feature lớn, đụng nhiều file/package, chưa rõ nên chia module thế nào | "Feature này sẽ ảnh hưởng nhiều package, hãy thiết kế cấu trúc trước khi viết code" | agent `architect` |
| Việc nhiều bước, cần nhiều agent phối hợp, chưa rõ thứ tự làm | "Việc này có nhiều bước phụ thuộc nhau, lập plan thứ tự thực hiện trước" | agent `planner` |
| Viết/sửa code một tính năng cụ thể, phạm vi rõ | Nêu rõ file/hành vi mong muốn, ví dụ: "Thêm endpoint POST /leads trong apps/api xử lý ..." | agent `implementer` (hoặc main thread tự làm nếu việc nhỏ) |
| Vừa sửa xong code, muốn kiểm tra lại | Thường **tự động** chạy sau khi code non-trivial được viết. Có thể chủ động: "review lại đoạn code vừa sửa" | agent `code-reviewer` |
| Code đụng auth, payment, upload file, input từ user | "review bảo mật đoạn xử lý thanh toán/auth này" — nói rõ từ "bảo mật"/"security" | agent `security-reviewer` |
| Trang/API chạy chậm thật sự (không phải đoán) | "trang X load chậm, đo và tối ưu giúp tôi" — nói rõ đã thấy chậm, không phải "làm cho nhanh hơn" chung chung | agent `perf-optimizer` |
| Có lỗi/bug nhưng chưa rõ nguyên nhân | "tại sao lỗi X xảy ra — tìm root cause trước, đừng sửa ngay" | agent `debugger` |
| Cần viết test cho hàm/API/component | "viết test cho hàm/API này, cả edge case" | agent `tester` |
| Sửa `package.json`, `tsconfig*`, `turbo.json`, oxlint/oxfmt config | Thường **tự động** review sau khi các file này đổi | agent `stack-guardian` |
| Deploy/hạ tầng (Cloudflare Workers/Pages/R2/KV, hoặc VPS + Dokploy khi vào giai đoạn 2) | Nói rõ "deploy", "wrangler", "Dokploy", "VPS" — xem chi tiết ở doc ops/07 | Claude tự làm trực tiếp theo infra-deployment-cost.md |
| Sửa code nhưng nghi ngờ docs (`docs/architecture`, `.claude/rules/tech-stack.md`, `.claude/agents/*.md`) đã lệch so với code thật | "kiểm tra xem docs có bị outdated so với code không" | agent `docs-guardian` |
| Muốn Claude **không** dùng subagent, tự làm trực tiếp | Nói rõ: "không cần agent, tự làm trực tiếp giúp tôi" | Claude bỏ qua agent routing |

## Mẹo để tăng độ chính xác

1. **Nói rõ quy mô**: "chỉ 1 file" vs "nhiều package" — đây là tín hiệu
   chính giữa việc Claude tự làm thẳng và việc gọi `architect`/`planner`.
2. **Nói rõ bạn muốn plan trước hay làm luôn** — nếu không nói, Claude mặc
   định làm luôn với việc nhỏ, rõ ràng.
3. **Dùng đúng từ khóa domain** (security, performance, root cause, test,
   wrangler, Dokploy, docs outdated...) — Claude so khớp theo mô tả, từ khóa
   càng khớp domain càng chính xác.
4. **Việc mơ hồ** ("làm cho X tốt hơn") sẽ khiến Claude tự suy luận phạm vi
   — nếu có ý cụ thể (chỉ sửa 1 hàm, hay refactor cả module), nói rõ ngay
   từ đầu để tránh làm hụt hoặc làm quá tay.

## Khi thêm agent/skill/rule mới

`description` trong frontmatter của agent/skill là thứ duy nhất Claude dùng
để tự động chọn — viết mô tả càng cụ thể, càng ít chồng lấn với agent/skill
khác thì việc tự động detect càng chính xác. Cập nhật bảng trên khi thêm
agent/skill mới vào `.claude/agents/` hoặc `.claude/skills/`.
