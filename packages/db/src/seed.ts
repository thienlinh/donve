import { createPostgresDb } from "./client/postgres-js.js";
import { landingPagesRepository } from "./repositories/landing-pages.js";
import { organizationsRepository } from "./repositories/organizations.js";
import { pageVersionsRepository } from "./repositories/page-versions.js";
import { skills } from "./schema/ai.js";
import { organizations } from "./schema/core.js";

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
`
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
`
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
`
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
`
  }
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required to seed");

  const db = createPostgresDb(databaseUrl);

  await Promise.all(
    PLATFORM_SKILLS.map((skill) =>
      db.raw
        .insert(skills)
        .values({ orgId: null, ...skill })
        .onConflictDoNothing()
    )
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
    `Seeded ${PLATFORM_SKILLS.length} platform skills, org "${demoOrg.slug}" (${demoOrg.id}), landing page "${demoLandingPage.name}" (${demoLandingPage.id})`
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
