#!/usr/bin/env bun
/**
 * Seeds the shared `templates` gallery (`packages/db/src/schema/templates.ts`) with a handful
 * of real, complete starter pages — built by hand-composing the actual catalog components
 * (`@dv/studio-catalog`), not scraped from any external site and not generated via an LLM call
 * (see `POST /:id/save-as-template`'s doc comment for why: the intended source of new templates
 * is a page a human brought to quality through the real Studio, and this script is the one-time
 * "seed the initial gallery" equivalent of that, written by hand instead). Idempotent — skips any
 * template whose name already exists, safe to re-run after tweaking copy.
 *
 * Usage: DATABASE_URL=postgres://... bun tooling/seed-templates/run.ts
 */
import { createPostgresDb, schema, templatesRepository } from "@dv/db";
import { eq } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}
const db = createPostgresDb(databaseUrl);

const tokens = {
  colorPrimary: "#111827",
  colorPrimaryForeground: "#ffffff",
  colorSurface: "#ffffff",
  colorForeground: "#111827",
  colorMuted: "#6b7280",
  colorBorder: "#e5e7eb",
  fontHeading: "Inter, sans-serif",
  fontBody: "Inter, sans-serif",
  radius: "0.5rem"
};

const image = { src: "https://placehold.co/800x600", alt: "demo" };

type Section = { type: string; props: Record<string, unknown> };

function buildPageSpec(prefix: string, sections: Section[]) {
  const elements: Record<
    string,
    { type: string; props: Record<string, unknown>; children: string[] }
  > = {
    "page-root": { type: "page_root", props: {}, children: [] }
  };
  const children: string[] = [];
  sections.forEach((section, index) => {
    const id = `${prefix}-${section.type}-${index}`;
    elements[id] = { type: section.type, props: section.props, children: [] };
    children.push(id);
  });
  elements["page-root"]!.children = children;
  return { root: "page-root", elements };
}

const templates = [
  {
    name: "SaaS Starter",
    industry: "SaaS",
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "TênSản Phẩm",
          links: [
            { label: "Tính năng", href: "#features" },
            { label: "Giá", href: "#pricing" }
          ],
          variant: "simple"
        }
      },
      {
        type: "hero",
        props: {
          headline: "Tự động hoá quy trình, tiết kiệm 10 giờ mỗi tuần",
          subheadline:
            "Phần mềm SaaS giúp đội ngũ của bạn làm việc nhanh hơn, ít lỗi hơn, không cần code.",
          ctaLabel: "Dùng thử miễn phí",
          ctaHref: "/signup",
          secondaryCtaLabel: "Xem demo",
          image,
          variant: "saas"
        }
      },
      {
        type: "problem_statement",
        props: {
          headline: "Quy trình thủ công đang làm chậm đội ngũ bạn",
          body: "Nhập liệu tay, đối chiếu file Excel, báo cáo trễ deadline — mỗi tuần đội ngũ mất hàng chục giờ cho việc lẽ ra máy tính có thể làm.",
          variant: "split_text_image"
        }
      },
      {
        type: "solution_overview",
        props: {
          headline: "Một nền tảng, toàn bộ quy trình tự động",
          body: "Kết nối dữ liệu, tự động hoá tác vụ lặp lại, và có báo cáo real-time — không cần đội kỹ thuật riêng.",
          variant: "split"
        }
      },
      {
        type: "feature_bento",
        props: {
          items: [
            {
              title: "Tự động hoá",
              description: "Thiết lập workflow không cần code"
            },
            {
              title: "Báo cáo real-time",
              description: "Dashboard cập nhật theo thời gian thực"
            },
            {
              title: "Bảo mật doanh nghiệp",
              description: "SSO, phân quyền theo team"
            },
            {
              title: "Tích hợp sẵn có",
              description: "Kết nối công cụ đang dùng trong vài phút"
            }
          ],
          variant: "2x2"
        }
      },
      {
        type: "how_it_works",
        props: {
          steps: [
            {
              title: "Kết nối dữ liệu",
              description: "Import từ hệ thống hiện tại chỉ trong vài phút"
            },
            {
              title: "Thiết lập workflow",
              description: "Kéo-thả, không cần viết code"
            },
            {
              title: "Theo dõi kết quả",
              description: "Dashboard báo cáo tự động cập nhật"
            }
          ],
          variant: "numbered_steps"
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Chọn gói phù hợp với đội ngũ của bạn",
          plans: [
            {
              name: "Starter",
              price: "0đ",
              period: "tháng",
              features: ["1 workflow", "1 người dùng", "Hỗ trợ email"],
              ctaLabel: "Bắt đầu miễn phí",
              ctaHref: "/signup",
              highlighted: false
            },
            {
              name: "Team",
              price: "990.000đ",
              period: "tháng",
              features: [
                "Workflow không giới hạn",
                "Tới 10 người dùng",
                "Hỗ trợ ưu tiên",
                "Báo cáo nâng cao"
              ],
              ctaLabel: "Dùng thử 14 ngày",
              ctaHref: "/signup",
              highlighted: true
            }
          ],
          variant: "2_tier"
        }
      },
      {
        type: "testimonial",
        props: {
          items: [
            {
              quote:
                "Chúng tôi giảm 70% thời gian xử lý báo cáo cuối tháng chỉ sau 2 tuần triển khai.",
              authorName: "Nguyễn Minh Anh",
              authorTitle: "Trưởng phòng Vận hành",
              evidenceRef: "testimonial-saas-1"
            }
          ],
          variant: "single_quote"
        }
      },
      {
        type: "faq_accordion",
        props: {
          items: [
            {
              question: "Có cần đội kỹ thuật riêng để triển khai không?",
              answer:
                "Không — thiết lập bằng giao diện kéo-thả, không cần biết code."
            },
            {
              question: "Dữ liệu của chúng tôi có an toàn không?",
              answer:
                "Có, dữ liệu được mã hoá và phân quyền truy cập theo từng thành viên."
            }
          ],
          variant: "single_column"
        }
      },
      {
        type: "cta_banner",
        props: {
          headline: "Sẵn sàng tiết kiệm hàng giờ mỗi tuần?",
          ctaLabel: "Dùng thử miễn phí ngay",
          ctaHref: "/signup",
          variant: "centered"
        }
      },
      {
        type: "footer",
        props: {
          logoText: "TênSản Phẩm",
          copyrightText: "© 2026 TênSản Phẩm",
          variant: "minimal"
        }
      }
    ]
  },
  {
    name: "Ra mắt sản phẩm (Ecommerce)",
    industry: "Ecommerce",
    sections: [
      {
        type: "announcement_bar",
        props: {
          text: "Ưu đãi ra mắt — giảm 20% cho 100 đơn đầu tiên",
          dismissible: true
        }
      },
      {
        type: "hero",
        props: {
          headline: "Sản phẩm mới đã có mặt — đặt trước ngay hôm nay",
          subheadline: "Chất lượng cao cấp, giao hàng toàn quốc trong 24h.",
          ctaLabel: "Đặt mua ngay",
          ctaHref: "#pricing",
          image,
          variant: "product"
        }
      },
      {
        type: "logo_wall",
        props: {
          logos: [image, image, image, image],
          variant: "grid"
        }
      },
      {
        type: "feature_grid",
        props: {
          items: [
            {
              title: "Chất liệu cao cấp",
              description: "Được kiểm định chất lượng nghiêm ngặt"
            },
            {
              title: "Bảo hành 12 tháng",
              description: "Đổi trả miễn phí trong 7 ngày"
            },
            {
              title: "Giao hàng nhanh",
              description: "Nhận hàng trong 24h tại nội thành"
            }
          ],
          variant: "icon_grid"
        }
      },
      {
        type: "gallery",
        props: { images: [image, image, image], variant: "grid" }
      },
      {
        type: "testimonial",
        props: {
          items: [
            {
              quote:
                "Chất lượng vượt mong đợi, đóng gói cẩn thận, giao hàng đúng hẹn.",
              authorName: "Trần Thị Hoa",
              authorTitle: "Khách hàng",
              evidenceRef: "testimonial-ecom-1"
            }
          ],
          variant: "single_quote"
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Chọn phiên bản phù hợp",
          plans: [
            {
              name: "Phiên bản tiêu chuẩn",
              price: "599.000đ",
              features: ["Đầy đủ tính năng cơ bản"],
              ctaLabel: "Đặt mua",
              ctaHref: "#",
              highlighted: false
            }
          ],
          variant: "single_plan"
        }
      },
      {
        type: "cta_sticky",
        props: {
          label: "Đặt mua ngay — giảm 20%",
          ctaHref: "#pricing",
          variant: "bottom_bar"
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Thương hiệu",
          copyrightText: "© 2026 Thương hiệu",
          variant: "minimal"
        }
      }
    ]
  },
  {
    name: "Dịch vụ địa phương — Thu lead",
    industry: "Dịch vụ local",
    sections: [
      {
        type: "hero",
        props: {
          headline: "Sửa chữa tại nhà — có mặt trong 30 phút",
          subheadline:
            "Đội ngũ kỹ thuật viên chuyên nghiệp, báo giá minh bạch trước khi làm.",
          ctaLabel: "Nhận báo giá miễn phí",
          ctaHref: "#lead-form",
          image,
          variant: "leadgen"
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Bảo hành 6 tháng" },
            { label: "Hơn 5000 khách hàng" },
            { label: "Kỹ thuật viên có chứng chỉ" }
          ],
          variant: "security"
        }
      },
      {
        type: "problem_statement",
        props: {
          headline: "Tự sửa vừa mất thời gian vừa rủi ro hỏng nặng hơn",
          body: "Đừng để một lỗi nhỏ trở thành sự cố lớn — gọi đúng người có chuyên môn ngay từ đầu.",
          variant: "split_text_image"
        }
      },
      {
        type: "how_it_works",
        props: {
          steps: [
            {
              title: "Gọi hoặc điền form",
              description: "Mô tả vấn đề, nhận báo giá trong 5 phút"
            },
            {
              title: "Kỹ thuật viên đến tận nơi",
              description: "Có mặt trong 30 phút nội thành"
            },
            {
              title: "Thanh toán sau khi hài lòng",
              description: "Không hài lòng không thu phí"
            }
          ],
          variant: "numbered_steps"
        }
      },
      {
        type: "testimonial",
        props: {
          items: [
            {
              quote:
                "Gọi lúc 8h tối mà kỹ thuật viên vẫn đến sửa xong trong 1 tiếng, giá rất hợp lý.",
              authorName: "Lê Văn Bình",
              authorTitle: "Khách hàng",
              evidenceRef: "testimonial-local-1"
            }
          ],
          variant: "single_quote"
        }
      },
      {
        type: "lead_form",
        props: {
          submitLabel: "Nhận báo giá miễn phí",
          consentText: "Tôi đồng ý được liên hệ để tư vấn báo giá",
          variant: "inline_progressive"
        }
      },
      {
        type: "faq_accordion",
        props: {
          items: [
            {
              question: "Chi phí báo giá có mất phí không?",
              answer:
                "Hoàn toàn miễn phí, không phát sinh nếu bạn không đồng ý."
            },
            {
              question: "Có làm việc cuối tuần không?",
              answer: "Có, phục vụ tất cả các ngày trong tuần kể cả lễ."
            }
          ],
          variant: "single_column"
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Dịch vụ sửa chữa",
          copyrightText: "© 2026",
          variant: "minimal"
        }
      }
    ]
  }
] satisfies { name: string; industry: string; sections: Section[] }[];

async function main() {
  for (const template of templates) {
    // oxlint-disable-next-line no-await-in-loop -- must stay sequential: check-then-insert by name, logs must stay in order
    const existing = await db.raw
      .select({ id: schema.templates.id })
      .from(schema.templates)
      .where(eq(schema.templates.name, template.name))
      .limit(1);
    if (existing.length > 0) {
      console.log(`skip (already exists): ${template.name}`);
      continue;
    }
    // oxlint-disable-next-line no-await-in-loop -- depends on the existence check above; must run after it, not in parallel
    await templatesRepository.insert(db, {
      name: template.name,
      industry: template.industry,
      thumbnailKey: null,
      pageSpec: buildPageSpec(
        template.industry.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        template.sections
      ),
      tokens,
      seo: null,
      architectureNotes: null
    });
    console.log(`seeded: ${template.name}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
