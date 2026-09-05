# Thesis: Đơn Về

## 1. Định vị bằng một câu

> **Đơn Về giúp người bán online Việt Nam không bao giờ để lọt một khách quan tâm hoặc một khoản tiền đã chuyển — từ nội dung social đến lead, đến tiền vào tài khoản, đến việc đã giao xong.**

Không phải "page builder", không phải "CRM", không phải "cổng thanh toán". Đây là **lớp giám sát dòng tiền và lead** chạy phía trên các mảnh rời rạc mà người bán solo đang tự chắp vá (TikTok/FB để marketing, tin nhắn Zalo để chốt đơn, app ngân hàng để dò chuyển khoản, Excel để nhớ việc).

## 2. Đối tượng thiết kế (không phải đối tượng đi tìm ngay bây giờ)

Solo creator / micro-business Việt Nam bán khoá học, coaching, workshop, dịch vụ có lịch hẹn qua TikTok/Facebook/Zalo. Đặc điểm: không muốn học CRM, chốt đơn bằng tin nhắn, nhận chuyển khoản/VietQR, có lead nhưng xử lý không đều, không biết nội dung nào ra tiền.

Founder chính là một người dùng thuộc nhóm này (dạy học qua TikTok) — thiết kế theo đúng nhu cầu của chính mình trước, không cần đi khảo sát ai khác ở giai đoạn này.

**Rõ ràng không nhắm tới ở giai đoạn này:** enterprise, agency white-label, shop cần tồn kho/logistics, marketplace, team sales lớn, developer cần page builder tổng quát.

## 3. Core loop — thứ duy nhất bắt buộc phải chạy mượt

```
Nội dung/link → Lead → Chốt đơn → Thanh toán (VietQR/chuyển khoản) → Đối soát tự động → Giao/fulfillment → Biết nguồn nào ra tiền
```

Mọi tính năng khác chỉ tồn tại để phục vụ một bước trong vòng lặp này. Nếu một ý tưởng không rút ngắn hoặc làm chắc chắn hơn một bước trong core loop, nó không thuộc phạm vi ưu tiên — bất kể nghe hay đến đâu.

**Wedge cụ thể (lý do mở app mỗi ngày):** phát hiện và hiển thị rõ **tiền/lead đang bị kẹt** — lead chưa liên hệ, chuyển khoản chưa đối soát, đơn đã trả tiền chưa giao — và đưa từng cái về trạng thái đã xong. Đây là giá trị khác biệt so với việc chỉ "tạo landing page đẹp".

## 4. Nguyên tắc sản phẩm (giữ tối thiểu, không mở rộng danh sách)

1. **Một hành động tiếp theo rõ ràng** — mỗi màn hình phải trả lời "giờ làm gì".
2. **Đơn giản mặc định, nâng cao khi cần** — năng lực phức tạp bị ẩn cho tới khi người dùng chủ động cần.
3. **Không có lỗi im lặng** — payment, webhook, fulfillment luôn có trạng thái đọc được, kể cả khi fail.
4. **AI đề xuất, người dùng duyệt** với hành động ảnh hưởng tiền hoặc khách hàng.
5. **Dogfood trước, mở rộng sau** — founder tự vận hành được 100% bằng chính nền tảng, không đọc code, trước khi tính chuyện mở rộng đối tượng.

## 5. Business model (tóm tắt)

- **Non-custodial**: nền tảng không giữ tiền hộ ai. Tiền vào thẳng tài khoản/provider của tenant (SePay/VietQR trước, mở rộng sau); nền tảng chỉ đọc webhook để đối soát. Đây là ranh giới pháp lý (tránh vai trò trung gian thanh toán cần giấy phép NHNN) — **không được đổi hướng "giữ tiền hộ" mà không review pháp lý trước**.
- **BYOK cho AI**: platform key có margin trên chi phí API; BYOK để user tự trả, nền tảng không gánh chi phí AI ở gói miễn phí.
- **Subscription theo tenant**: giá chưa chốt, sẽ chốt bằng dữ liệu vận hành thật của founder trước khi bán ra ngoài.
- **Kênh GTM dự phòng** (chưa cần chạy ngay): TikTok cá nhân của founder, mỗi landing publish tự thành showcase.

## 6. NFR không thương lượng

Tenant isolation (org_id + RLS), webhook idempotent, mã hoá key BYOK (AES-256-GCM), sanitize HTML/iframe sandbox, tuân Nghị định 13/2023 (consent không tick sẵn, quyền xoá/xuất dữ liệu). Đây là các thứ một lỗi sẽ phá vỡ niềm tin ngay cả trước khi có user — giữ nguyên bất kể roadmap thay đổi thế nào.
