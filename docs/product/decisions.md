# Quyết định đã khoá

Tài liệu này tồn tại để không phải tranh luận lại cùng một câu hỏi mỗi lần có ý tưởng mới. Sửa file này chỉ khi có lý do cụ thể, không sửa vì "chợt nghĩ ra hướng hay hơn" — hướng hay hơn thì thêm vào mục 3 (ý tưởng gác lại), không đổi quyết định đã khoá ngay.

## 1. Đã khoá

- **Định vị theo core loop, không theo module.** Giá trị nằm ở chuỗi lead → tiền → giao hàng chạy mượt, không nằm ở số lượng tính năng. Xem `thesis.md`.
- **Không đi tìm user thật ở giai đoạn này, và không đặt điều kiện "khi nào".** Việc verify luồng hoạt động dựa vào test/demo đầy đủ case (bao gồm giả lập luồng người dùng thật qua công cụ tự động hoá trình duyệt, không phải chỉ chạy tay 1 lần), không dựa vào việc tìm design partner/khảo sát thị trường. Câu hỏi "khi nào tìm user thật" không còn là câu hỏi mở — chỉ quay lại khi founder chủ động muốn mở rộng ra ngoài, không phải một mốc lịch trình.
- **Pricing: thiết kế linh hoạt theo nhiều trục, không hardcode 1 công thức.** Kiến trúc billing phải cho phép platform admin tạo/gán plan khác nhau theo từng nhóm khách hàng (per-tenant override, nhiều trục đo: số offer active, lead/tháng, đơn đã thanh toán/tháng), không khoá cứng vào một trục duy nhất ở tầng data model. Trục nào là "gói mặc định" bán ra ngoài sẽ chốt bằng dữ liệu vận hành thật của founder — nhưng đó là việc chọn số, không phải việc chọn kiến trúc; kiến trúc linh hoạt phải có sẵn trước.
- **Non-custodial payment**, không giữ tiền hộ ai. Mọi thay đổi hướng ngược lại phải review pháp lý trước khi code, không phải sau.
- **BYOK là mặc định cho AI**, không xây LLM/hạ tầng proprietary ở giai đoạn này.
- **Ẩn năng lực nâng cao khỏi luồng chính**: Campaigns/Products/Skills/Prompt-templates là công cụ nền, không phải điểm vào chính của trải nghiệm.
- **HTML/ZIP import (do AI cá nhân của user tạo) sửa trực tiếp trên HTML gốc — không có đường convert sang PageSpec nữa.** Đã phân tích code thật (2026-09-04): legacy Studio (srcmap) đã bị retired khỏi đường import từ trước, không phải giải pháp đang chạy. Cơ chế đang chạy đúng là thứ cần: import → sanitize → lưu HTML thuần → sửa bằng AI-chat search/replace trên chính HTML đó, không mất fidelity, không cần AI "hiểu cấu trúc". Tính năng "convert-to-native" (chuyển một chiều sang PageSpec) đã bị **xoá hoàn toàn** (2026-09-04) — không còn cần thiết vì đường edit trực tiếp đã đủ tốt, và loại bỏ luôn rủi ro chuyển đổi một chiều/mất fidelity. Studio mới (PageSpec) vẫn giữ `raw_html_block` như một component chung (dùng cho AI patch/generation fallback khác), không liên quan tới custom-import nữa.

## 2. Không làm trong giai đoạn hiện tại

Marketplace · white-label agency · logistics/inventory · A/B testing · LMS đầy đủ · omnichannel inbox hoàn chỉnh · email/ZNS sequence engine · hỗ trợ nhiều chục payment provider cùng lúc · billing tier phức tạp · rewrite toàn bộ frontend · tách microservice vì lý do kiến trúc thuần tuý.

Lý do chung: chưa có bằng chứng nội bộ (founder tự dùng) cho thấy các thứ này cần thiết cho core loop. Thêm bây giờ là suy đoán.

**Ngoại lệ (2026-09-04, đã cutover 2026-09-05):** tổ chức lại UI/UX/IA (điều hướng, nhóm tính năng) + khu vực Studio/Thư viện prompt, xây song song ở route mới (`/next/*`) trước khi thay hẳn route cũ, **không tính là "rewrite toàn bộ frontend"** bị khoá ở trên — không đổi stack/backend, dựng trên component/logic đã có (`kết hợp với những gì đã có`), không phá luồng đang chạy vì route cũ vẫn giữ nguyên cho tới khi founder tự duyệt và quyết định chuyển hẳn. Founder chủ động yêu cầu sau khi tự dùng nền tảng và thấy trải nghiệm hiện tại chưa đạt mức "tuyệt vời nhất" mong muốn — đúng tinh thần "dogfood trước" của thesis.md, không phải suy đoán nhu cầu bên ngoài.

Kết quả sau khi review kỹ (2026-09-05): 6/7 trang dưới `/next/*` (Hôm nay, Sản phẩm đang bán, Studio, Studio-native, Custom Import) hoá ra **dùng lại y hệt component của route cũ** — không phải bản viết lại, chỉ khác path. Điểm khác biệt thật duy nhất là (a) Thư viện prompt có component mới (`PromptLibraryGalleryPage` — layout 2 cột, xem trước trực tiếp theo thiết bị) và (b) sidebar có nút "Tìm kiếm" hiển thị cho command palette mà bản cũ thiếu. Founder đã duyệt: đưa cả hai cải tiến đó vào thẳng route chính, sau đó **xoá toàn bộ cây `/next/*`** (route tree, `AppShellNext`/`SidebarNext`, mọi nhánh `insideNext` rải rác trong `studio-page.tsx`/`landing-card.tsx`/`offer-workspace-page.tsx`/`custom-import-page.tsx`/`studio-native-page.tsx`/`generate-from-prompt-dialog.tsx`) — giữ một cây route trùng lặp không tạo thêm giá trị chỉ tốn công bảo trì song song.

## 3. Ý tưởng gác lại (chưa quyết, không triển khai)

Ghi ngắn gọn mỗi khi có ý tưởng mới không phục vụ core loop hiện tại, để không mất nhưng cũng không làm phân tán roadmap. Format: `- [ngày] ý tưởng — vì sao gác lại`.

_(trống — cập nhật khi phát sinh)_

## 4. Câu hỏi mở

- Convert-to-native (HTML import → PageSpec) là một chiều — có nên thêm cảnh báo/preview trước khi convert, hay chấp nhận rủi ro vì tính năng ít dùng? Chốt khi có dữ liệu dùng thật.
