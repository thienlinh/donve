import { eq, notInArray } from "drizzle-orm";

import { createPostgresDb } from "./client/postgres-js.js";
import { landingPagesRepository } from "./repositories/landing-pages.js";
import { organizationsRepository } from "./repositories/organizations.js";
import { pageVersionsRepository } from "./repositories/page-versions.js";
import { templatesRepository } from "./repositories/templates.js";
import { skills } from "./schema/ai.js";
import { organizations } from "./schema/core.js";
import { promptLibraryEntries } from "./schema/prompt-library.js";

/**
 * All 4 land as `isActiveDefault: true` (FR-F) — they're general landing-page-quality
 * knowledge (SEO/perf/copywriting/forms), not a per-tenant preference, so every org's own AI
 * generation carries them automatically; the existing per-landing-page Studio "skills" toggle
 * (`apps/donve/src/features/skills/components/skills-page.tsx`) still lets anyone opt a
 * specific page out via `landingSkills`.
 */
const PLATFORM_SKILLS = [
  {
    slug: "seo-landing-vn",
    name: "SEO cho landing page Việt Nam",
    content: `# SEO cho landing page (thị trường Việt Nam)

Tối ưu landing page để xếp hạng tốt trên Google.com.vn và các máy tìm kiếm
tiếng Việt, đồng thời giữ trải nghiệm đọc tự nhiên cho người dùng Việt.

## Hướng dẫn

- Viết \`<title>\` chứa từ khóa chính trong 60 ký tự đầu, có tên thương hiệu ở cuối.
- Viết \`meta description\` 140-160 ký tự, có lời kêu gọi hành động (CTA) rõ ràng.
- Dùng đúng một thẻ \`<h1>\` chứa từ khóa chính; các \`<h2>\`/\`<h3>\` triển khai ý phụ.
- Thêm \`hreflang="vi"\` và \`lang="vi"\` trên \`<html>\`.
- Đặt structured data (JSON-LD) \`Product\`/\`Organization\`/\`FAQPage\` khi phù hợp.
- Ảnh có \`alt\` mô tả bằng tiếng Việt không dấu ký tự lạ, dùng định dạng WebP.
- URL ngắn, không dấu, phân tách bằng dấu gạch ngang.
- Không nhồi nhét từ khóa — mật độ tự nhiên, ưu tiên ngữ nghĩa liên quan (LSI).
- Đảm bảo tốc độ tải trang (xem skill \`cwv-budget\`) vì đây là yếu tố xếp hạng.

## Checklist

- [ ] Title + meta description đã tối ưu và không bị cắt
- [ ] Một \`<h1>\` duy nhất chứa từ khóa chính
- [ ] JSON-LD hợp lệ (kiểm tra bằng Rich Results Test)
- [ ] Toàn bộ ảnh có \`alt\` tiếng Việt mô tả đúng nội dung
- [ ] Canonical URL được khai báo, không trùng lặp nội dung
`,
    isActiveDefault: true
  },
  {
    slug: "cwv-budget",
    name: "Ngân sách hiệu năng Core Web Vitals",
    content: `# Ngân sách hiệu năng (Core Web Vitals)

Giữ landing page trong ngưỡng "Good" của Core Web Vitals — ảnh hưởng trực
tiếp đến thứ hạng SEO và tỉ lệ chuyển đổi (mỗi 100ms chậm thêm có thể làm
giảm conversion).

## Ngân sách mục tiêu

- **LCP** (Largest Contentful Paint) ≤ 2.5s
- **INP** (Interaction to Next Paint) ≤ 200ms
- **CLS** (Cumulative Layout Shift) ≤ 0.1
- Tổng kích thước trang (nén) ≤ 500KB, ảnh hero ≤ 150KB
- Không quá 1 web font, preload font quan trọng nhất

## Hướng dẫn

- Đặt \`width\`/\`height\` (hoặc \`aspect-ratio\`) trên mọi \`<img>\`/\`<video>\` để tránh CLS.
- Ảnh hero dùng \`fetchpriority="high"\`, các ảnh dưới fold dùng \`loading="lazy"\`.
- Không chèn script chặn render (\`<script>\` không có \`defer\`/\`async\`) trong \`<head>\`.
- Inline CSS tới hạn (above-the-fold), phần còn lại tải không chặn render.
- Tránh layout shift do quảng cáo/banner/cookie-notice chèn động — dành sẵn không gian.
- Nén ảnh về WebP/AVIF, giới hạn độ phân giải theo kích thước hiển thị thực tế.

## Checklist

- [ ] LCP, INP, CLS đều trong ngưỡng "Good" (đo bằng Lighthouse)
- [ ] Không có phần tử nào gây layout shift sau khi tải xong
- [ ] Ảnh/video đều khai báo kích thước tường minh
- [ ] Không có script chặn render trong \`<head>\`
`,
    isActiveDefault: true
  },
  {
    slug: "copywriting-chuyen-doi",
    name: "Copywriting chuyển đổi (AIDA/PAS)",
    content: `# Copywriting chuyển đổi cao (AIDA / PAS)

Viết nội dung landing page tiếng Việt tối ưu tỉ lệ chuyển đổi, dùng hai
khung viết kinh điển: AIDA và PAS.

## AIDA (Attention → Interest → Desire → Action)

1. **Attention**: Tiêu đề (headline) đánh thẳng vào nỗi đau hoặc mong muốn lớn nhất.
2. **Interest**: Đoạn mở đầu nêu lý do khách hàng nên quan tâm ngay bây giờ.
3. **Desire**: Liệt kê lợi ích cụ thể (không chỉ tính năng), dùng bằng chứng xã hội (testimonial, số liệu).
4. **Action**: CTA rõ ràng, một hành động duy nhất, dùng động từ mệnh lệnh ("Đăng ký ngay", "Nhận ưu đãi").

## PAS (Problem → Agitate → Solve)

1. **Problem**: Nêu đúng vấn đề khách hàng mục tiêu đang gặp.
2. **Agitate**: Khoét sâu hậu quả nếu vấn đề không được giải quyết.
3. **Solve**: Giới thiệu sản phẩm/dịch vụ như giải pháp trực tiếp cho vấn đề đó.

## Hướng dẫn viết tiếng Việt

- Câu ngắn, chủ động, tránh bị động và từ Hán Việt khó hiểu.
- Xưng hô gần gũi ("bạn"), tránh trang trọng quá mức trừ khi đối tượng là B2B/doanh nghiệp.
- Mỗi block chỉ một thông điệp chính, một CTA.
- Số liệu, cam kết cụ thể (VD: "Tăng 30% doanh thu") thay vì mô tả chung chung.
- Luôn có một CTA chính lặp lại ở đầu, giữa và cuối trang.

## Checklist

- [ ] Headline áp dụng đúng công thức AIDA hoặc PAS
- [ ] Mỗi section chỉ có một thông điệp chính
- [ ] CTA xuất hiện tối thiểu ở đầu/giữa/cuối trang, dùng động từ mệnh lệnh
- [ ] Có ít nhất một bằng chứng xã hội (testimonial, số liệu, logo khách hàng)
`,
    isActiveDefault: true
  },
  {
    slug: "thiet-ke-truc-quan-khong-generic",
    name: "Thiết kế trực quan — tránh giao diện AI chung chung",
    content: `# Thiết kế trực quan — tránh giao diện AI chung chung

AI tạo trang thường mặc định về cùng một khuôn: hero gradient tím-xanh, 3
thẻ icon tròn giống hệt nhau, bo góc 2xl khắp nơi, cùng một khoảng đệm lặp
lại. Khách hàng nhận ra ngay đây là "trang do AI tạo" và mất niềm tin dù
nội dung/cấu trúc bên dưới đúng. Khoá một hệ thống thị giác cụ thể ngay từ
đầu — giống cách một nhà thiết kế thật quyết định trước khi viết dòng CSS
đầu tiên — để mọi trang có cá tính riêng thay vì trông như bản sao của
nhau.

## Hướng dẫn

- **Khoá bảng màu cụ thể trước khi viết CSS**: chọn đúng 4-6 màu bằng mã
  hex cụ thể (nền chính, nền phụ, chữ chính, chữ phụ, 1-2 màu nhấn) — không
  dùng tên chung chung như "primary blue". Rút màu nhấn từ chính nội dung/
  ảnh của trang (VD: màu từ ảnh sản phẩm, màu thương hiệu khách hàng) thay
  vì mặc định tím/xanh dương của AI.
- **Khoá kiểu chữ cụ thể**: chọn đúng 2 font (Google Fonts) — một font cho
  heading (có cá tính, không phải font mặc định của trình duyệt), một font
  cho nội dung — khai báo rõ độ đậm (weight) và letter-spacing dùng ở đâu.
  Không dùng font hệ thống mặc định (Arial/system-ui) cho heading.
- **Danh sách BẮT BUỘC / CẤM tránh giao diện AI chung chung**:
  - CẤM: hero với nền gradient tím-xanh dương hoặc gradient nhiều màu cầu
    vồng — đây là dấu hiệu rõ nhất của "trang do AI tạo".
  - CẤM: lưới 3 thẻ giống hệt nhau chỉ khác icon/tiêu đề (icon tròn nền
    nhạt + heading + 1 dòng mô tả) lặp lại nhiều lần trong trang — nếu có
    3 lợi ích, hãy trình bày chúng theo cách khác nhau hoặc bất đối xứng.
  - CẤM: hình khối/blob trôi nổi trang trí không mang ý nghĩa nội dung.
  - CẤM: bo góc 2xl/3xl áp dụng đồng loạt cho mọi thẻ/nút/ảnh không phân
    biệt — chọn MỘT mức bo góc nhất quán với cá tính trang (sắc/vuông cho
    B2B nghiêm túc, bo tròn nhiều cho sản phẩm thân thiện/trẻ trung).
  - BẮT BUỘC: có ít nhất một điểm nhấn thị giác khác biệt gắn với đúng nội
    dung của trang này (không thể copy sang trang khác mà vẫn hợp) — ví dụ
    một con số lớn, một trích dẫn nổi bật, một cách trình bày giá khác
    thường, chứ không phải trang nào cũng giống trang nào.
  - BẮT BUỘC: phân cấp thị giác rõ ràng — heading chính phải to/đậm hơn
    hẳn phần còn lại, không để mọi khối có cùng kích thước chữ và khoảng
    đệm khiến trang "phẳng", không có điểm nhấn mắt nhìn vào trước.

## Checklist

- [ ] Bảng màu khai báo bằng mã hex cụ thể, không dùng gradient tím-xanh dương
- [ ] Đúng 2 font, khai báo rõ nơi dùng heading/nội dung, không dùng font hệ thống cho heading
- [ ] Không có 3+ thẻ icon giống hệt nhau lặp lại
- [ ] Có ít nhất một điểm nhấn thị giác gắn riêng với nội dung trang này
- [ ] Heading chính nổi bật rõ rệt so với phần còn lại của trang
`,
    isActiveDefault: true
  },
  {
    slug: "vi-chuyen-dong-css-thuan",
    name: "Vi chuyển động CSS thuần (không cần JS)",
    content: `# Vi chuyển động CSS thuần (không cần JS)

Nền tảng này luôn xoá mọi thẻ \`<script>\` trước khi xuất bản (xem skill
"Thiết kế trực quan"), nên mọi hiệu ứng chuyển động phải làm bằng CSS
thuần — \`:hover\`, \`:focus-visible\`, \`transition\`, \`@keyframes\`. Dùng đúng
1-2 hiệu ứng có chủ đích, gắn liền với cá tính thương hiệu, thay vì rải
hiệu ứng khắp nơi khiến trang rối mắt hoặc chậm.

## Các kỹ thuật đã kiểm chứng (hoạt động ổn định trên mọi trình duyệt)

- **Nút "nhấn xuống" (hard shadow press)**: nút có viền đậm + đổ bóng
  cứng ở trạng thái bình thường; khi hover/active, dịch chuyển
  \`transform: translate(4px, 4px)\` và bỏ bóng — mô phỏng cảm giác vừa
  được ấn xuống. Hợp phong cách Neo-Brutalist, năng động.
- **Nâng nhẹ khi hover (lift)**: thẻ/card khi hover nâng lên
  \`transform: translateY(-4px)\`, đổ bóng đậm hơn hoặc viền sáng dần —
  hợp phong cách cao cấp, tối giản.
- **Gạch chân mọc dần (underline grow)**: link/nút dạng text có
  \`::after\` là một đường kẻ rộng 0, khi hover mở rộng thành 100% bằng
  \`transition: width .25s\` — tinh tế, không tốn hiệu năng.
- **Marquee logo/badge chạy vô hạn**: dải logo khách hàng/đối tác chạy
  ngang liên tục bằng \`@keyframes\` dịch chuyển \`transform: translateX\`
  từ 0 đến -50% trên một dải nội dung lặp lại đúng 2 lần, \`animation\`
  \`linear infinite\` — không cần JS, chạy mượt trên mọi thiết bị.
  Bọc trong \`@media (prefers-reduced-motion: reduce)\` để tắt animation
  cho người dùng đã bật giảm chuyển động ở hệ điều hành.
- **Đếm số khan hiếm nhấp nháy (pulse)**: badge số chỗ/suất còn lại
  dùng \`@keyframes\` đổi \`opacity\` giữa 1 và 0.7 lặp lại chậm (1.5-2s) để
  hút mắt vào tính khan hiếm — không lạm dụng, chỉ dùng cho đúng một
  phần tử khan hiếm thật trên trang.

## KHÔNG dùng

- Hiệu ứng cuộn trang (scroll-triggered/parallax nặng, \`animation-timeline: view()\`)
  — trình duyệt chưa hỗ trợ đồng đều, dễ vỡ trải nghiệm trên một số máy khách hàng.
- Animation chạy liên tục trên nhiều phần tử cùng lúc — gây rối mắt và
  giật máy yếu/điện thoại cũ (đối tượng khách hàng Việt Nam dùng nhiều
  điện thoại tầm trung).
- Bất kỳ thuộc tính \`onXXX\` hay thẻ \`<script>\` nào — sẽ bị xoá và không hoạt động.

## Checklist

- [ ] Toàn trang chỉ có 1-2 hiệu ứng chuyển động có chủ đích, không rải khắp nơi
- [ ] Mọi hiệu ứng dùng CSS thuần (\`:hover\`/\`:focus-visible\`/\`transition\`/\`@keyframes\`), không phụ thuộc JS
- [ ] Animation lặp vô hạn (marquee, pulse) có \`prefers-reduced-motion\` fallback
- [ ] Không dùng hiệu ứng scroll-triggered phụ thuộc trình duyệt mới
`,
    isActiveDefault: true
  },
  {
    slug: "form-phễu-chuẩn",
    name: "Form phễu (funnel) chuẩn",
    content: `# Form phễu (funnel) chuẩn

Đảm bảo mọi landing page có một form thu lead đúng chuẩn, dễ điền, dễ theo
dõi và không rò rỉ khách hàng tiềm năng ở bước cuối cùng của phễu.

## Hướng dẫn

- Form đặt ở vị trí above-the-fold và lặp lại ít nhất một lần dưới trang.
- Tối đa 3-4 trường bắt buộc (Họ tên, Số điện thoại là tối thiểu) — mỗi trường thêm làm giảm conversion.
- Input số điện thoại dùng \`type="tel"\`, có validate định dạng Việt Nam (10 số, đầu 03/05/07/08/09).
- Mọi \`<input>\` có \`<label>\` liên kết đúng \`for\`/\`id\` (accessibility + autofill).
- Nút submit có text hành động cụ thể ("Nhận tư vấn miễn phí"), không chỉ "Gửi".
- Có trạng thái loading/disabled khi submit để tránh gửi trùng lặp.
- Có thông báo thành công rõ ràng (inline hoặc trang cảm ơn) sau khi submit.
- Gắn tracking event (form_submit) để đo tỉ lệ chuyển đổi của phễu.
- Có checkbox đồng ý chính sách bảo mật khi thu thập dữ liệu cá nhân (tuân thủ Nghị định 13/2023).

## Checklist

- [ ] Form nằm above-the-fold, tối đa 3-4 trường bắt buộc
- [ ] Số điện thoại được validate đúng định dạng Việt Nam
- [ ] Mọi input có label liên kết đúng, hoạt động tốt với autofill
- [ ] Có trạng thái loading khi submit, chặn gửi trùng lặp
- [ ] Có thông báo/tracking xác nhận submit thành công
`,
    isActiveDefault: true
  }
];

/**
 * Restated in full at the end of every `promptText` below (not just linked/summarized) because
 * the prompt has to survive being pasted into an unrelated external AI tool (ChatGPT etc.) with
 * no other context about this platform — see `packages/studio-core/src/sanitize.ts`'s
 * `DANGEROUS_TAGS` for why constraint 1 is permanent and non-negotiable. Kept in sync by hand
 * with `packages/studio-ai/src/prompt.ts`'s `BASE_GENERATE_PROMPT` (the platform's own AI
 * generation carries the identical lead-capture requirement) — update both together.
 */
const PROMPT_CONSTRAINTS = `

YÊU CẦU KỸ THUẬT BẮT BUỘC (áp dụng cho toàn bộ output):
1. Tuyệt đối KHÔNG dùng thẻ \`<script>\` dưới bất kỳ hình thức nào và KHÔNG dùng bất kỳ thuộc tính \`onclick\`/\`onchange\`/\`onXXX\` nào — nền tảng này tự động xoá mọi thẻ \`<script>\` trước khi xuất bản, nên bất cứ hiệu ứng nào phụ thuộc vào JavaScript sẽ âm thầm không hoạt động. Mọi tương tác (accordion, tab, toggle) phải làm bằng HTML/CSS thuần: \`<details>\`/\`<summary>\` cho accordion, cặp \`<input type="radio">\`/\`<input type="checkbox">\` ẩn kết hợp CSS \`:checked\` cho tab/toggle.
2. Trả về đúng MỘT file HTML hoàn chỉnh, CSS viết inline trong một thẻ \`<style>\` ở \`<head>\`, không phụ thuộc file CSS/JS ngoài nào. Ngoại lệ DUY NHẤT: đúng một link Google Fonts (kèm 2 thẻ \`<link rel="preconnect">\` bắt buộc đi cùng) để dùng một font thật thay vì font mặc định của trình duyệt — chọn đúng font Google Fonts có hỗ trợ bộ ký tự tiếng Việt (Vietnamese subset) để dấu tiếng Việt hiển thị đúng, ví dụ: Be Vietnam Pro, Inter, Sora, Manrope, Plus Jakarta Sans, Montserrat, Playfair Display, Lora, Nunito Sans.`;

/**
 * Shared skeleton for every full-page prompt below (docs/product/thesis.md's persona set) —
 * one paragraph per requirement so each generated prompt reads as continuous prose, the way a
 * person would actually type it into ChatGPT, not a bullet list. `extraFieldLabel` is the one
 * offer-specific optional field beyond the fixed fullName/phone/email/consent set (e.g. a
 * preferred-date field for đặt lịch) — matches the exact lead-capture contract the runtime
 * reads (`apps/landing-runtime/src/lead-form.ts`'s `KNOWN_FIELDS`).
 */
function buildFullPagePrompt(input: {
  hook: string;
  visualSystem: string;
  pricingShape: string;
  urgencyMechanic: string;
  extraFieldLabel: string;
}): string {
  const { hook, visualSystem, pricingShape, urgencyMechanic, extraFieldLabel } =
    input;
  return (
    [
      hook,
      `Về hệ thống thị giác — khoá cụ thể trước khi viết CSS, không lấy phong cách AI mặc định chung chung (xem đầy đủ kỹ thuật trong skill "Thiết kế trực quan — tránh giao diện AI chung chung"): ${visualSystem}`,
      `Phần đầu trang (above-the-fold) chỉ có một headline duy nhất nêu thẳng kết quả/lợi ích khách hàng nhận được (không liệt kê tính năng chung chung), một dòng mô tả phụ ngắn, và một nút CTA chính — nút CTA này phải lặp lại y hệt (cùng label, cùng hành động) ở đầu trang, giữa trang và cuối trang. Không đặt một CTA thứ hai cạnh tranh sự chú ý với CTA chính.`,
      `Thứ tự các section phải theo đúng luồng sau, và thứ tự trong HTML (thứ tự nội dung) phải khớp với thứ tự hiển thị thực tế trên mobile — không dùng CSS (\`order\`, \`flex-direction: column-reverse\`, absolute positioning...) để đảo ngược thứ tự đọc, vì phần lớn khách truy cập landing page này trên điện thoại và đọc tuyến tính từ trên xuống: (1) Hero với CTA chính; (2) Vấn đề/nỗi đau của khách hàng mục tiêu; (3) Giải pháp/lợi ích cụ thể (không chỉ liệt kê tính năng — nêu rõ khách hàng được gì); (4) Bằng chứng xã hội — đặt ngay sau phần lợi ích để giải toả nghi ngờ đúng lúc khách vừa bị thuyết phục nhưng chưa tin hẳn, dùng testimonial có tên thật, ảnh đại diện và kết quả cụ thể (không dùng câu chung chung như "dịch vụ rất tốt"); (5) Bảng giá — ${pricingShape}, áp dụng kỹ thuật anchoring: hiển thị giá gốc gạch ngang (thẻ \`<del>\` hoặc CSS \`text-decoration: line-through\`) bên cạnh giá ưu đãi, và đóng khung trực quan (viền nổi bật, nhãn "Phổ biến nhất") cho gói được đề xuất; (6) Cam kết/bảo đảm — đặt ngay sau bảng giá, đúng lúc khách đang lo lắng nhất về rủi ro khi bỏ tiền ra; (7) FAQ xử lý đúng 4-6 phản đối phổ biến nhất: giá có đáng không, mất bao lâu mới có kết quả, có phù hợp với hoàn cảnh của tôi không, và được hỗ trợ gì sau khi mua/đăng ký; (8) CTA cuối trang lặp lại cùng form thu lead.`,
      `Về tính cấp bách (urgency/scarcity): ${urgencyMechanic} Chỉ dùng cơ chế có thật, gắn với thực tế của offer — tuyệt đối cấm bịa số liệu giả hoặc gắn đồng hồ đếm ngược giả không tương ứng với hạn thật, vì điều này vi phạm lòng tin của khách và có thể vi phạm quy định quảng cáo.`,
      `Về văn phong: áp dụng khung AIDA (Attention → Interest → Desire → Action) hoặc PAS (Problem → Agitate → Solve) cho phần copy, viết câu ngắn, giọng chủ động, xưng "bạn" với khách hàng — không cần diễn giải lại toàn bộ kỹ thuật copywriting ở đây vì đã có sẵn trong skill "Copywriting chuyển đổi (AIDA/PAS)" của nền tảng.`,
      `Về hình ảnh: tối đa một ảnh hero nặng (kích thước lớn nhất trang), tất cả ảnh còn lại phải có thuộc tính \`loading="lazy"\` và khai báo kích thước (\`width\`/\`height\` hoặc \`aspect-ratio\`) để tránh giật layout khi tải. Về khả năng tiếp cận: mọi \`<img>\` có \`alt\` mô tả bằng tiếng Việt, toàn trang chỉ có đúng một thẻ \`<h1>\`, và màu chữ/nền phải đủ độ tương phản để đọc được kể cả ngoài trời nắng.`,
      `Form thu lead PHẢI khớp chính xác với hệ thống thật, vì đây là cách duy nhất hệ thống nhận diện được một lượt lead: bọc form trong \`<form data-dv-form="lead">\`, trường họ tên dùng đúng \`name="fullName"\` (không phải \`full_name\`), số điện thoại dùng \`name="phone"\` với \`type="tel"\`, email dùng \`name="email"\` với \`type="email"\`, thêm một trường phụ tuỳ chọn \`${extraFieldLabel}\`, và bắt buộc có một checkbox \`name="consent"\` (ví dụ nhãn "Tôi đồng ý được liên hệ"). Thiếu đúng các thuộc tính này (kể cả chỉ sai chính tả \`name\`) thì hệ thống sẽ không đọc được dữ liệu form, lead sẽ âm thầm bị mất dù khách đã bấm gửi.`
    ].join("\n\n") + PROMPT_CONSTRAINTS
  );
}

const PLATFORM_PROMPTS = [
  {
    slug: "khoa-hoc-online",
    title: "Trang bán khoá học online",
    description:
      "Prompt tạo trọn vẹn trang bán một khoá học online: hero, vấn đề/lợi ích, bảng giá theo gói, đánh giá học viên, FAQ — một file HTML.",
    promptText: buildFullPagePrompt({
      hook: "Bạn là chuyên gia thiết kế landing page chuyển đổi cao. Hãy tạo một trang landing page bán một khoá học online hoàn chỉnh cho [tên khoá học, chủ đề, đối tượng học viên mục tiêu]. Nhiều khoá học chất lượng tốt vẫn bán chậm không phải vì nội dung kém, mà vì trang bán hàng chưa đủ thuyết phục — hãy tập trung vào kết quả/chuyển đổi học viên đạt được sau khoá học, không liệt kê chương trình học khô khan.",
      visualSystem:
        "phong cách Neo-Brutalist năng động, hợp với đối tượng trẻ/creator economy. Bảng màu: nền vàng #FFE17C làm màu chủ đạo cho hero, nền phụ than đậm #171E19, chữ đen #0A0A0A trên nền vàng và chữ vàng nhạt #FFE17C trên nền than, một màu nhấn xanh bạc hà #7DDBC5 dùng cho badge/highlight. Viền đen 2px solid trên mọi thẻ/nút/khung ảnh, đổ bóng cứng không blur (`box-shadow: 4px 4px 0 #000` cho phần tử nhỏ, `8px 8px 0 #000` cho khối lớn như card giá) thay vì box-shadow mờ thông thường. Bo góc nhỏ 8-12px, không bo tròn quá mức. Font heading dùng 'Be Vietnam Pro' đậm 800, chữ hoa, letter-spacing âm nhẹ; font nội dung dùng 'Inter' 400-500. Vi chuyển động DUY NHẤT xuyên suốt trang: nút bấm khi hover dịch chuyển `transform: translate(4px,4px)` và bỏ box-shadow để mô phỏng cảm giác vừa được ấn xuống — chỉ dùng CSS `:hover`/`transition`, không dùng JS.",
      pricingShape:
        "3 gói học (ví dụ: Tự học video, Học + hỗ trợ Q&A, Học + mentor 1-1 kèm chữa bài), mỗi gói liệt kê rõ quyền lợi khác nhau (số buổi hỗ trợ, thời hạn truy cập, có chứng chỉ hay không)",
      urgencyMechanic:
        "Dùng hạn đăng ký ưu đãi khai giảng cụ thể (ví dụ ngày đóng đơn của đợt tuyển sinh hiện tại) và/hoặc số suất ưu đãi giá sớm còn lại thật trong đợt này (ví dụ số suất mentor 1-1 có giới hạn vì một mentor chỉ kèm được số lượng học viên nhất định)",
      extraFieldLabel:
        "trình độ/mục tiêu học hiện tại (ví dụ select: Mới bắt đầu / Đã có nền tảng / Muốn nâng cao)"
    }),
    sortOrder: 1
  },
  {
    slug: "coaching-tu-van-1-1",
    title: "Trang bán coaching/tư vấn 1-1",
    description:
      "Prompt tạo trọn vẹn trang bán dịch vụ coaching/tư vấn 1-1: hero, nỗi đau khách hàng, gói theo số buổi, cam kết, FAQ — một file HTML.",
    promptText: buildFullPagePrompt({
      hook: "Bạn là chuyên gia thiết kế landing page chuyển đổi cao. Hãy tạo một trang landing page bán dịch vụ coaching/tư vấn 1-1 hoàn chỉnh cho [tên chuyên gia/dịch vụ, lĩnh vực coaching, ví dụ: tài chính cá nhân, sự nghiệp, sức khoẻ tinh thần]. Khách hàng tìm coaching 1-1 vì họ đã tự loay hoay một mình và không thấy tiến bộ — hãy đánh thẳng vào vấn đề cụ thể đó ngay từ đầu trang thay vì giới thiệu chung chung về bản thân coach.",
      visualSystem:
        "phong cách tối giản cao cấp, nền tối, hợp với dịch vụ 1-1 giá trị cao cần truyền tải sự tin cậy và chuyên môn. Bảng màu: nền chính đen ấm #0C0C0D, nền phụ #17181A, chữ chính trắng ngà #EDE7DC, chữ phụ xám #9CA3A8, một màu nhấn đồng/vàng cổ điển #C9A15C dùng rất tiết chế (chỉ cho gạch chân, icon nhỏ, viền badge — không tô nền lớn). Viền hairline mờ `rgba(237,231,220,.12)` thay vì viền đậm. Thẻ giá/testimonial dùng hiệu ứng kính mờ nhẹ: `background: rgba(255,255,255,.03); backdrop-filter: blur(20px)`. Font heading dùng 'Playfair Display' in nghiêng (italic) 600, cỡ lớn, letter-spacing âm nhẹ để tạo cảm giác biên tập cao cấp; font nội dung dùng 'Inter' 400. Vi chuyển động DUY NHẤT: card/testimonial khi hover nâng nhẹ `transform: translateY(-4px)` kèm viền sáng dần lên `border-color` chuyển từ mờ sang rõ trong 0.3s — chỉ dùng CSS `:hover`/`transition`, không dùng JS, không dùng hiệu ứng cuộn trang (scroll-triggered) vì trình duyệt chưa hỗ trợ ổn định.",
      pricingShape:
        "3 gói theo số buổi (ví dụ: 1 buổi trải nghiệm, gói 4 buổi, gói 8 buổi đồng hành dài hạn), gói giữa hoặc gói dài hạn được đề xuất vì mang lại kết quả bền vững hơn một buổi lẻ",
      urgencyMechanic:
        "Nêu rõ số slot coaching thật nhận trong tháng vì đây là dịch vụ 1-1 nên coach chỉ nhận được một số lượng khách nhất định mỗi tháng để đảm bảo chất lượng — không nhận vô hạn",
      extraFieldLabel:
        "vấn đề bạn muốn được tư vấn (textarea ngắn để coach chuẩn bị trước buổi đầu tiên)"
    }),
    sortOrder: 2
  },
  {
    slug: "workshop-su-kien",
    title: "Trang đăng ký workshop/sự kiện",
    description:
      "Prompt tạo trọn vẹn trang đăng ký workshop/sự kiện có ngày giờ cụ thể và số chỗ giới hạn: hero, lịch trình, diễn giả, FAQ — một file HTML.",
    promptText: buildFullPagePrompt({
      hook: "Bạn là chuyên gia thiết kế landing page chuyển đổi cao. Hãy tạo một trang landing page đăng ký một workshop/sự kiện hoàn chỉnh cho [tên workshop, chủ đề, ngày giờ cụ thể, hình thức online/offline]. Nêu ngay thời gian và địa điểm/hình thức cụ thể ở phần đầu trang — khách hàng cần biết ngay sự kiện có khớp lịch của họ không trước khi đọc tiếp bất cứ điều gì khác.",
      visualSystem:
        "phong cách poster sự kiện, tương phản cao, tạo cảm giác gấp gáp/đáng chú ý. Bảng màu: nền chính kem sáng #FAF6EE, một khối màu san hô đậm #E24E3E cho hero/CTA, một màu nhấn xanh cổ vịt #1F5B57 cho badge ngày giờ, chữ chính than đen #1A1A1A. Khối ngày-giờ-địa điểm trình bày như vé sự kiện thật: khung viền đứt nét `border: 2px dashed`, bo góc nhỏ, đặt ngay dưới headline. Font heading dùng 'Montserrat' đậm 800, chữ hoa toàn bộ, letter-spacing rộng (`letter-spacing: .04em`) kiểu poster; font nội dung dùng 'Inter' 400-500. Vi chuyển động DUY NHẤT: số đếm chỗ trống còn lại (badge số ghế) có `animation` nhấp nháy nhẹ nền (pulse) bằng CSS `@keyframes` (đổi opacity 1↔0.7, 1.6s, infinite) để hút mắt vào tính khan hiếm thật — chỉ CSS thuần, không dùng JS đếm ngược động.",
      pricingShape:
        "giá vé early bird (đăng ký sớm) và giá vé thường/tại cửa, cộng thêm ưu đãi giá theo nhóm nếu đăng ký từ 2-3 người trở lên, gói early bird được đóng khung là lựa chọn tiết kiệm nhất",
      urgencyMechanic:
        "Hiển thị số chỗ còn lại thật (vì địa điểm/hình thức tổ chức có sức chứa giới hạn thật) và hạn chót đăng ký cụ thể theo ngày giờ thật (ví dụ 23:59 ngày trước sự kiện 2 ngày để ban tổ chức kịp chuẩn bị số lượng)",
      extraFieldLabel:
        "hình thức tham dự mong muốn (select: Trực tiếp tại địa điểm / Tham dự online)"
    }),
    sortOrder: 3
  },
  {
    slug: "dich-vu-dat-lich",
    title: "Trang đặt lịch hẹn dịch vụ",
    description:
      "Prompt tạo trọn vẹn trang đặt lịch cho dịch vụ theo giờ (spa, phòng khám, tư vấn): hero, lợi ích, bảng giá dịch vụ, form chọn ngày giờ — một file HTML.",
    promptText: buildFullPagePrompt({
      hook: "Bạn là chuyên gia thiết kế landing page chuyển đổi cao. Hãy tạo một trang landing page đặt lịch hẹn hoàn chỉnh cho [tên cơ sở/dịch vụ, ví dụ: spa, phòng khám nha khoa, phòng tư vấn tâm lý theo giờ]. Khách hàng đặt lịch loại dịch vụ này quan tâm nhất đến sự tiện lợi (đặt lịch nhanh, không phải gọi điện chờ) và độ tin cậy chuyên môn — hãy làm nổi bật cả hai ngay từ đầu trang.",
      visualSystem:
        "phong cách ấm áp, đáng tin cậy, dịu mắt — hợp với dịch vụ chăm sóc cá nhân (spa/nha khoa/tư vấn). Bảng màu: nền kem ấm #FBF3EA, nền phụ be nhạt #F1E4D4, chữ chính nâu than #3A2E26, một màu nhấn terracotta #C1694F cho CTA/nhấn, một màu nhấn xanh sage nhạt #A9B99F cho badge phụ. Bo góc lớn và nhất quán (16-20px) trên mọi thẻ/nút/ảnh để tạo cảm giác mềm mại, đổ bóng rất nhẹ và mờ (`box-shadow: 0 8px 24px rgba(58,46,38,.08)`), không dùng viền cứng. Font heading dùng 'Lora' in nghiêng 600 cho các câu dẫn cảm xúc, 'Nunito Sans' 700 cho số liệu/tiêu đề phụ; font nội dung dùng 'Nunito Sans' 400. Vi chuyển động DUY NHẤT: khung giờ trống trong lịch khi hover đổi nền sang màu terracotta nhạt và icon giờ xoay nhẹ 8 độ (`transform: rotate(8deg)`) — chỉ CSS `:hover`/`transition`, không dùng JS.",
      pricingShape:
        "bảng giá theo từng dịch vụ/liệu trình cụ thể (ví dụ: buổi khám đơn lẻ, gói liệu trình nhiều buổi có giá ưu đãi hơn tính theo buổi lẻ), gói liệu trình nhiều buổi được đề xuất vì tiết kiệm hơn",
      urgencyMechanic:
        "Nêu khung giờ trống thật còn lại trong tuần (ví dụ: chỉ còn vài khung giờ chiều thứ 7 tuần này) và/hoặc ưu đãi thật cho khách đặt lịch trước một số ngày cụ thể",
      extraFieldLabel:
        'ngày giờ mong muốn (input `type="date"` hoặc `type="datetime-local"` để khách chọn khung giờ họ muốn đặt)'
    }),
    sortOrder: 4
  }
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required to seed");

  const db = createPostgresDb(databaseUrl);

  // `onConflictDoUpdate` (not `onConflictDoNothing`) — a platform skill's `content` is meant to
  // be edited in this file over time (confirmed live 2026-09-04: a content-only edit to an
  // already-seeded skill silently never reached the database until this was an upsert), so
  // re-running this script must sync content to what's in code, not just fill in missing rows.
  await Promise.all(
    PLATFORM_SKILLS.map((skill) =>
      db.raw
        .insert(skills)
        .values({ orgId: null, ...skill })
        .onConflictDoUpdate({
          target: [skills.orgId, skills.slug],
          set: { name: skill.name, content: skill.content }
        })
    )
  );

  // Deletes any stale entry not in the current `PLATFORM_PROMPTS` (e.g. the 22 section-level
  // prompts this 4-entry set replaced) — pre-launch/staging-only data (no production tenants),
  // so a destructive re-seed here is safe and keeps re-running this script idempotent with the
  // gallery's current content, not just additive.
  await db.raw.delete(promptLibraryEntries).where(
    notInArray(
      promptLibraryEntries.slug,
      PLATFORM_PROMPTS.map((entry) => entry.slug)
    )
  );
  // `onConflictDoUpdate` for the same reason as `PLATFORM_SKILLS` above — a prompt's
  // `promptText`/`description` are meant to be edited here over time, so a re-seed must sync
  // content, not just insert-if-missing (confirmed live 2026-09-04: editing an existing entry's
  // `promptText` and re-seeding silently left the old text in the database).
  await Promise.all(
    PLATFORM_PROMPTS.map((entry) =>
      db.raw
        .insert(promptLibraryEntries)
        .values(entry)
        .onConflictDoUpdate({
          target: promptLibraryEntries.slug,
          set: {
            title: entry.title,
            description: entry.description,
            promptText: entry.promptText,
            sortOrder: entry.sortOrder
          }
        })
    )
  );

  // Links each of the 4 full-page prompt entries to its matching real template so the detail
  // panel can render a rendered preview + "use this template" button. `tooling/seed-templates`
  // is a separate, manually-invoked script (not run from here) and its rows get fresh uuidv7
  // ids each run, so this looks each template up by name rather than a hardcoded id — a no-op,
  // leaving `templateId` null for that entry, when that script hasn't been run yet in this
  // environment.
  const seededTemplates = await templatesRepository.list(db);
  const templatesByName = new Map(
    seededTemplates.map((template) => [template.name, template])
  );
  const ENTRY_TEMPLATE_NAMES: Record<string, string> = {
    "khoa-hoc-online": "Khoá học Marketing Online",
    "coaching-tu-van-1-1": "Coach Tài chính Cá nhân 1-1",
    "workshop-su-kien": "Workshop Kỹ năng Thuyết trình",
    "dich-vu-dat-lich": "Phòng khám Nha khoa (Đặt lịch)"
  };
  await Promise.all(
    Object.entries(ENTRY_TEMPLATE_NAMES).map(([slug, templateName]) => {
      const template = templatesByName.get(templateName);
      if (!template) return Promise.resolve();
      return db.raw
        .update(promptLibraryEntries)
        .set({ templateId: template.id })
        .where(eq(promptLibraryEntries.slug, slug));
    })
  );

  await db.raw
    .insert(organizations)
    .values({ name: "Demo Org", slug: "demo-org" })
    .onConflictDoNothing({ target: organizations.slug });
  const demoOrg = await organizationsRepository.findBySlug(db, "demo-org");
  if (!demoOrg) throw new Error("demo org seed failed");

  const existingLandingPages = await landingPagesRepository.list(
    db,
    demoOrg.id
  );
  let demoLandingPage = existingLandingPages.find(
    (page) => page.name === "Demo Landing Page"
  );
  if (!demoLandingPage) {
    const inserted = await landingPagesRepository.insert(db, demoOrg.id, {
      name: "Demo Landing Page",
      campaignId: null,
      currentVersionId: null,
      thumbnailKey: null,
      chatSessionId: null,
      source: "import"
    });
    if (!inserted) throw new Error("demo landing page seed failed");
    demoLandingPage = inserted;

    const version = await pageVersionsRepository.insert(db, demoOrg.id, {
      landingPageId: demoLandingPage.id,
      seq: 1,
      // `wrangler r2 object put dv-landing-assets-dev/<key> --file=... --local`
      // to place a matching object for local `/api/landings/:id/html` reads.
      htmlKey: `landing-pages/${demoLandingPage.id}/v1/index.html`,
      srcmapKey: `landing-pages/${demoLandingPage.id}/v1/srcmap.json`,
      origin: "import",
      patch: null,
      chatMessageId: null,
      label: "Initial import",
      createdBy: null
    });
    if (!version) throw new Error("demo page version seed failed");

    await landingPagesRepository.update(db, demoOrg.id, demoLandingPage.id, {
      currentVersionId: version.id
    });
  }

  console.log(
    `Seeded ${PLATFORM_SKILLS.length} platform skills, ${PLATFORM_PROMPTS.length} prompt library entries, org "${demoOrg.slug}" (${demoOrg.id}), landing page "${demoLandingPage.name}" (${demoLandingPage.id})`
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
