#!/usr/bin/env bun
/**
 * Seeds the shared `templates` gallery (`packages/db/src/schema/templates.ts`) with
 * hand-composed, real-copy starter pages — built from the actual catalog components
 * (`@dv/studio-catalog`), not scraped from any external site and not generated via an LLM call
 * (see `POST /:id/save-as-template`'s doc comment for why: the intended source of new templates
 * is a page a human brought to quality through the real Studio, and this script is the one-time
 * "seed the initial gallery" equivalent of that, written by hand instead).
 *
 * Not idempotent-by-name — this table has zero production tenants yet, so a re-run fully
 * replaces the whole gallery (`templatesRepository.deleteAll`) rather than skip-if-exists, to
 * keep re-seeding after a copy/token tweak a one-command operation. `TEMPLATES` below is the
 * full gallery, one `TemplateDef` per template — add a new domain by adding an entry, not by
 * replacing the file.
 *
 * After inserting each template, renders its `pageSpec` to HTML via `@dv/studio-render`'s SSR
 * path and screenshots it with Playwright's Chromium to produce `thumbnailKey` — the same
 * "seed-time only" capture this gallery needs, since there's no live page to auto-capture a
 * `.thumbnail.jpg` from the way a real landing page does.
 *
 * Usage: DATABASE_URL=postgres://... bun tooling/seed-templates/run.ts
 */
import type { TemplateIndustry } from "@dv/contracts";
import { createPostgresDb, templatesRepository } from "@dv/db";
import { storage } from "@dv/drivers";
import { catalogComponents } from "@dv/studio-catalog";
import { renderPageArtifact } from "@dv/studio-render";
import { chromium } from "@playwright/test";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}
const db = createPostgresDb(databaseUrl);

// Inline SVG data URI, not `placehold.co` — a same-origin-in-spirit placeholder that never
// makes a network request, so it can't trip cross-origin/CORS errors in the editor canvas (an
// external host was flaky here: browsers issue a separate credentialed preload/prefetch probe
// for cross-origin images in some cases, which `placehold.co`'s wildcard CORS header rejects).
function placeholderImage(alt: string, bg: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="#${bg}"/></svg>`;
  return { src: `data:image/svg+xml,${encodeURIComponent(svg)}`, alt };
}

type Purpose =
  | "understanding"
  | "desire"
  | "proof"
  | "risk_reduction"
  | "action";
type Section = {
  type: string;
  props: Record<string, unknown>;
  note: { purpose: Purpose; reason: string };
};
type Tokens = {
  colorPrimary: string;
  colorPrimaryForeground: string;
  colorAccent: string;
  colorAccentForeground: string;
  colorSurface: string;
  colorForeground: string;
  colorMuted: string;
  colorBorder: string;
  fontHeading: string;
  fontBody: string;
  radius: string;
};
type TemplateDef = {
  slug: string;
  name: string;
  industry: TemplateIndustry;
  tokens: Tokens;
  sections: Section[];
  seo: { title: string; description: string };
};

const TEMPLATES: TemplateDef[] = [
  {
    slug: "beauty",
    name: "Spa & Chăm sóc da (Beauty)",
    industry: "beauty",
    // Warm, spa-appropriate palette — deep sage + terracotta clay on a cream surface, deliberately
    // not the generic purple-gradient SaaS look (`taste-frontend`/`frontend-aesthetic-philosophies`).
    tokens: {
      colorPrimary: "#2F3B2E",
      colorPrimaryForeground: "#FBF7F2",
      colorAccent: "#C97C5D",
      colorAccentForeground: "#FBF7F2",
      colorSurface: "#FBF7F2",
      colorForeground: "#2B2B26",
      colorMuted: "#7A7267",
      colorBorder: "#E4DACD",
      fontHeading: "Playfair Display, sans-serif",
      fontBody: "Work Sans, sans-serif",
      radius: "0.75rem"
    },
    seo: {
      title: "Lụa Skin Studio — Chăm sóc da chuyên sâu, đặt lịch online",
      description:
        "Facial, peel da và massage Kobido cá nhân hoá theo tình trạng da. Đặt lịch tư vấn miễn phí cùng chuyên viên có chứng chỉ quốc tế."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Lụa Skin Studio",
          links: [
            { label: "Dịch vụ", href: "#services" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Đánh giá", href: "#testimonials" }
          ],
          ctaLabel: "Đặt lịch",
          ctaHref: "#booking",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "Luôn có CTA đặt lịch trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline: "Làn da khoẻ đẹp tự nhiên, chăm sóc bởi chuyên gia",
          subheadline:
            "Facial, peel da và massage Kobido cá nhân hoá theo tình trạng da — đặt lịch tư vấn miễn phí cùng chuyên viên trong 24h.",
          ctaLabel: "Đặt lịch tư vấn miễn phí",
          ctaHref: "#booking",
          secondaryCtaLabel: "Xem bảng giá",
          secondaryCtaHref: "#pricing",
          image: placeholderImage(
            "Không gian trị liệu tại Lụa Skin Studio",
            "EAD9C9"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold: hình ảnh không gian + lời hứa 'da khoẻ đẹp tự nhiên'."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Chứng chỉ CIDESCO quốc tế" },
            { label: "8+ năm kinh nghiệm trị liệu da" },
            { label: "Mỹ phẩm thuần chay, không paraben" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Chứng chỉ chuyên môn xoá lo ngại 'liệu tay nghề có đảm bảo không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Dịch vụ chăm sóc da chuyên sâu",
          items: [
            {
              title: "Facial chuyên sâu",
              description:
                "Làm sạch sâu, cấp ẩm và phục hồi hàng rào bảo vệ da theo từng loại da."
            },
            {
              title: "Trị liệu ánh sáng LED",
              description:
                "Kích thích collagen, cải thiện sắc tố da không xâm lấn, không đau."
            },
            {
              title: "Massage mặt Kobido",
              description:
                "Kỹ thuật massage cổ truyền Nhật Bản giúp nâng cơ và thư giãn sâu."
            },
            {
              title: "Peel da hoá học nhẹ",
              description:
                "Tái tạo bề mặt da, làm mờ thâm nám an toàn cho mọi loại da."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason: "Liệt kê rõ 4 dịch vụ chính để khách hiểu studio làm được gì."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Không gian trị liệu",
          images: [
            placeholderImage("Phòng trị liệu facial", "E4DACD"),
            placeholderImage("Khu vực tiếp đón", "EAD9C9"),
            placeholderImage("Phòng massage Kobido", "D8C4AE"),
            placeholderImage("Quầy sản phẩm dưỡng da", "E4DACD")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason: "Không gian thật giúp khách hình dung trải nghiệm tại chỗ."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Khách hàng nói gì",
          items: [
            {
              quote:
                "Da mình cải thiện rõ rệt chỉ sau 3 buổi trị liệu, không gian yên tĩnh, nhân viên rất tận tâm.",
              authorName: "Ngô Bảo Trâm",
              authorTitle: "Khách hàng thân thiết",
              evidenceRef: "testimonial-beauty-1"
            },
            {
              quote:
                "Liệu trình Kobido là trải nghiệm thư giãn nhất mình từng thử — da căng bóng thấy rõ ngay sau buổi đầu.",
              authorName: "Đặng Thu Hiền",
              authorTitle: "Chuyên viên marketing",
              evidenceRef: "testimonial-beauty-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason: "Trích dẫn khách thật, mỗi quote có evidenceRef xác thực."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Liệu trình chăm sóc da",
          plans: [
            {
              name: "Cơ bản",
              price: "450.000đ",
              period: "buổi",
              features: [
                "Facial làm sạch sâu",
                "Massage mặt thư giãn 15 phút",
                "Tư vấn loại da miễn phí"
              ],
              ctaLabel: "Đặt lịch",
              ctaHref: "#booking",
              highlighted: false
            },
            {
              name: "Chuyên sâu",
              price: "890.000đ",
              period: "buổi",
              features: [
                "Facial chuyên sâu + LED trị liệu",
                "Massage Kobido nâng cơ 30 phút",
                "Mặt nạ dưỡng chuyên biệt",
                "Tư vấn & theo dõi 1-1"
              ],
              ctaLabel: "Đặt lịch ngay",
              ctaHref: "#booking",
              highlighted: true
            },
            {
              name: "VIP trọn gói",
              price: "3.200.000đ",
              period: "5 buổi",
              features: [
                "Liệu trình Chuyên sâu x5 buổi",
                "Peel da hoá học 1 lần",
                "Ưu đãi 15% dịch vụ lẻ",
                "Set dưỡng da mini tặng kèm"
              ],
              ctaLabel: "Liên hệ tư vấn",
              ctaHref: "#booking",
              highlighted: false
            }
          ],
          variant: "3_tier"
        },
        note: {
          purpose: "action",
          reason: "3 mức giá rõ ràng, gói giữa được đề xuất (highlighted)."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question: "Da nhạy cảm có trị liệu được không?",
              answer:
                "Có — mọi liệu trình đều được điều chỉnh theo tình trạng da, riêng da nhạy cảm sẽ dùng sản phẩm dịu nhẹ chuyên biệt."
            },
            {
              question: "Cần chuẩn bị gì trước buổi đầu tiên?",
              answer:
                "Không cần chuẩn bị gì đặc biệt — chuyên viên sẽ tư vấn và soi da trước khi bắt đầu liệu trình."
            },
            {
              question: "Bao lâu thì thấy hiệu quả?",
              answer:
                "Đa số khách hàng thấy da căng mịn hơn ngay sau buổi đầu, hiệu quả rõ rệt sau 3-4 buổi liên tiếp."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 3 băn khoăn phổ biến nhất khi đặt lịch."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đặt lịch hẹn tại Lụa Skin Studio",
          submitLabel: "Xác nhận đặt lịch",
          showEmail: true,
          showPersona: true,
          personaOptions: ["Da dầu", "Da khô", "Da hỗn hợp", "Da nhạy cảm"],
          consentText: "Tôi đồng ý được liên hệ để xác nhận lịch hẹn",
          variant: "inline_progressive"
        },
        note: {
          purpose: "action",
          reason: "Form đặt lịch chính — điểm chuyển đổi của toàn trang."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Lụa Skin Studio",
          links: [
            { label: "Dịch vụ", href: "#services" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Liên hệ", href: "#booking" }
          ],
          copyrightText: "© 2026 Lụa Skin Studio",
          newsletterPlaceholder: "Email của bạn",
          variant: "with_newsletter"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Thông tin liên hệ/newsletter củng cố sự tin cậy ở cuối trang."
        }
      }
    ]
  },
  {
    slug: "fnb",
    name: "Nhà hàng (F&B)",
    industry: "other",
    // Warm terracotta + charcoal on a warm ivory surface — distinct from beauty's sage/clay,
    // still deliberately not the generic purple-gradient SaaS look.
    tokens: {
      colorPrimary: "#7A2E1D",
      colorPrimaryForeground: "#FBF3E7",
      colorAccent: "#C08A34",
      colorAccentForeground: "#2B211A",
      colorSurface: "#FBF3E7",
      colorForeground: "#2B211A",
      colorMuted: "#8A7A68",
      colorBorder: "#E7D9C3",
      fontHeading: "Fraunces, serif",
      fontBody: "Karla, sans-serif",
      radius: "0.5rem"
    },
    seo: {
      title: "Nhà Hàng Hương Việt — Đặt bàn ẩm thực Việt hiện đại",
      description:
        "Ẩm thực Việt hiện đại giữa lòng thành phố. Đặt bàn nhanh, ưu đãi nhóm và tiệc riêng cho mọi dịp."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Hương Việt",
          links: [
            { label: "Thực đơn", href: "#menu" },
            { label: "Không gian", href: "#gallery" },
            { label: "Đánh giá", href: "#testimonials" }
          ],
          ctaLabel: "Đặt bàn",
          ctaHref: "#booking",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA đặt bàn luôn trong tầm mắt khi khách cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline: "Ẩm thực Việt hiện đại, đậm đà hương vị quê nhà",
          subheadline:
            "Nguyên liệu tuyển chọn mỗi ngày, thực đơn theo mùa — đặt bàn trước để giữ chỗ đẹp nhất cho buổi tối của bạn.",
          ctaLabel: "Đặt bàn ngay",
          ctaHref: "#booking",
          secondaryCtaLabel: "Xem thực đơn",
          secondaryCtaHref: "#menu",
          image: placeholderImage(
            "Không gian nhà hàng Hương Việt về đêm",
            "E7D9C3"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold: không gian ấm cúng + lời hứa 'đậm đà hương vị quê nhà'."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Đầu bếp 15+ năm kinh nghiệm" },
            { label: "Nguyên liệu tươi mỗi ngày" },
            { label: "4.8/5 trên 1.200+ đánh giá" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Số liệu và uy tín xoá lo ngại 'liệu đồ ăn có ngon không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Món đặc trưng của nhà hàng",
          items: [
            {
              title: "Bò lá lốt nướng than hoa",
              description:
                "Thịt bò ướp sả ớt, cuốn lá lốt vườn nhà, nướng than hoa thơm lừng."
            },
            {
              title: "Cá kho tộ truyền thống",
              description:
                "Kho niêu đất theo công thức gia truyền, đậm đà chuẩn vị Bắc."
            },
            {
              title: "Gỏi cuốn tôm thịt",
              description: "Cuốn tay tại bàn, chấm cùng nước chấm tự pha."
            },
            {
              title: "Lẩu hải sản chua cay",
              description:
                "Hải sản tươi sống, nước lẩu ninh xương 8 tiếng, hợp ăn nhóm."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason: "Giới thiệu 4 món signature để khách hình dung thực đơn."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Không gian nhà hàng",
          images: [
            placeholderImage("Khu vực bàn ngoài trời", "E7D9C3"),
            placeholderImage("Phòng tiệc riêng", "D8C0A0"),
            placeholderImage("Quầy bar & khu chờ", "C9AE84"),
            placeholderImage("Không gian trong nhà chính", "E7D9C3")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason: "Hình ảnh không gian thật giúp khách hình dung trải nghiệm."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Thực khách nói gì",
          items: [
            {
              quote:
                "Đặt tiệc công ty 30 người ở đây, món ăn ngon và phục vụ rất chu đáo, chắc chắn quay lại.",
              authorName: "Trần Minh Quân",
              authorTitle: "Khách hàng doanh nghiệp",
              evidenceRef: "testimonial-fnb-1"
            },
            {
              quote:
                "Cá kho tộ đúng vị nhà làm, không gian ấm cúng hợp cho bữa tối gia đình cuối tuần.",
              authorName: "Lê Thị Hồng Nhung",
              authorTitle: "Khách hàng thân thiết",
              evidenceRef: "testimonial-fnb-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason: "Trích dẫn khách thật, mỗi quote có evidenceRef xác thực."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Gói tiệc & set menu",
          plans: [
            {
              name: "Set đôi",
              price: "590.000đ",
              period: "2 người",
              features: [
                "4 món chính theo mùa",
                "Khai vị & tráng miệng",
                "Nước chấm pha riêng theo món"
              ],
              ctaLabel: "Đặt bàn",
              ctaHref: "#booking",
              highlighted: false
            },
            {
              name: "Set gia đình",
              price: "1.490.000đ",
              period: "4-5 người",
              features: [
                "7 món chính đa dạng",
                "Lẩu hải sản chua cay",
                "Tráng miệng & trà đặc sản",
                "Ưu tiên chỗ ngồi đẹp"
              ],
              ctaLabel: "Đặt bàn ngay",
              ctaHref: "#booking",
              highlighted: true
            },
            {
              name: "Tiệc riêng",
              price: "Liên hệ",
              period: "10+ người",
              features: [
                "Thực đơn tuỳ chỉnh theo yêu cầu",
                "Phòng riêng có sẵn",
                "Ưu đãi cho công ty/nhóm lớn"
              ],
              ctaLabel: "Liên hệ tư vấn",
              ctaHref: "#booking",
              highlighted: false
            }
          ],
          variant: "3_tier"
        },
        note: {
          purpose: "action",
          reason: "3 mức giá rõ ràng, gói giữa được đề xuất (highlighted)."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question: "Có cần đặt bàn trước không?",
              answer:
                "Nên đặt trước ít nhất 2 tiếng vào cuối tuần để đảm bảo có chỗ, đặc biệt với nhóm từ 6 người trở lên."
            },
            {
              question: "Nhà hàng có phòng tiệc riêng không?",
              answer:
                "Có — phòng riêng phục vụ tối đa 30 khách, phù hợp tiệc công ty, sinh nhật, họp mặt gia đình."
            },
            {
              question: "Thực đơn có món chay không?",
              answer:
                "Có nhóm món chay riêng, có thể yêu cầu điều chỉnh khi đặt bàn hoặc trực tiếp tại nhà hàng."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 3 băn khoăn phổ biến nhất khi đặt bàn."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đặt bàn tại Hương Việt",
          submitLabel: "Xác nhận đặt bàn",
          showEmail: true,
          showPersona: true,
          personaOptions: ["2 người", "4-5 người", "6-9 người", "10+ người"],
          consentText: "Tôi đồng ý được liên hệ để xác nhận đặt bàn",
          variant: "inline_progressive"
        },
        note: {
          purpose: "action",
          reason: "Form đặt bàn chính — điểm chuyển đổi của toàn trang."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Hương Việt",
          links: [
            { label: "Thực đơn", href: "#menu" },
            { label: "Không gian", href: "#gallery" },
            { label: "Liên hệ", href: "#booking" }
          ],
          copyrightText: "© 2026 Nhà Hàng Hương Việt",
          newsletterPlaceholder: "Email của bạn",
          variant: "with_newsletter"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Thông tin liên hệ/newsletter củng cố sự tin cậy ở cuối trang."
        }
      }
    ]
  }
];

function validateSections(sections: Section[]) {
  for (const section of sections) {
    const component = catalogComponents[section.type];
    if (!component) {
      throw new Error(`unknown component "${section.type}"`);
    }
    const result = component.props.safeParse(section.props);
    if (!result.success) {
      throw new Error(
        `invalid props for "${section.type}": ${result.error?.message}`
      );
    }
  }
}

function buildPageSpec(slug: string, sections: Section[]) {
  const elements: Record<
    string,
    { type: string; props: Record<string, unknown>; children: string[] }
  > = {
    "page-root": { type: "page_root", props: {}, children: [] }
  };
  const architectureNotes: Record<
    string,
    { purpose: Purpose; reason: string }
  > = {};
  const children: string[] = [];
  sections.forEach((section, index) => {
    const id = `${slug}-${section.type}-${index}`;
    elements[id] = { type: section.type, props: section.props, children: [] };
    architectureNotes[id] = section.note;
    children.push(id);
  });
  elements["page-root"]!.children = children;
  return { pageSpec: { root: "page-root", elements }, architectureNotes };
}

/** Renders the template to HTML and screenshots it with Chromium — best-effort: a failure here
 * (e.g. no network for placeholder images/fonts) leaves `thumbnailKey` null rather than failing
 * the whole seed, since the template row itself is already valid and useful without a preview. */
async function captureThumbnail(
  templateId: string,
  pageSpec: ReturnType<typeof buildPageSpec>["pageSpec"],
  tokens: Tokens,
  title: string
): Promise<string | null> {
  const artifact = await renderPageArtifact({
    spec: pageSpec,
    tokens,
    title,
    hostname: "template-preview.internal",
    canonicalPath: "/",
    runtimeConfig: {
      orgId: "template",
      campaignId: null,
      deployId: "template-preview"
    }
  });

  // `artifact.html`'s catalog stylesheet is a real deployment asset
  // (`assets/<hash>.css`, referenced as `/assets/...`) — meaningless to `page.setContent`,
  // which has no server behind it to resolve that request against. Inline it directly instead
  // of standing up a route/asset server just for a one-shot local screenshot.
  const cssAsset = artifact.assets.find((asset) => asset.mime === "text/css");
  const html = cssAsset
    ? artifact.html.replace(
        "</head>",
        `<style>${new TextDecoder().decode(cssAsset.bytes)}</style></head>`
      )
    : artifact.html;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 }
    });
    await page.setContent(html, {
      waitUntil: "networkidle",
      timeout: 30_000
    });
    const screenshot = await page.screenshot({ type: "jpeg", quality: 80 });

    const storageDriver = storage.createLocalFsStorageDriver(
      process.env.LOCAL_STORAGE_DIR ?? ".data/storage"
    );
    const key = `templates/${templateId}/thumbnail.jpg`;
    await storageDriver.put({
      key,
      body: screenshot,
      contentType: "image/jpeg"
    });
    return key;
  } finally {
    await browser.close();
  }
}

async function seedTemplate(def: TemplateDef) {
  validateSections(def.sections);

  const { pageSpec, architectureNotes } = buildPageSpec(def.slug, def.sections);
  const template = await templatesRepository.insert(db, {
    name: def.name,
    industry: def.industry,
    thumbnailKey: null,
    pageSpec,
    tokens: def.tokens,
    seo: def.seo,
    architectureNotes
  });
  if (!template) throw new Error(`template insert failed: ${def.slug}`);
  console.log(`seeded: ${template.name} (${template.id})`);

  try {
    const thumbnailKey = await captureThumbnail(
      template.id,
      pageSpec,
      def.tokens,
      template.name
    );
    if (thumbnailKey) {
      await templatesRepository.update(db, template.id, { thumbnailKey });
      console.log(`thumbnail captured: ${thumbnailKey}`);
    }
  } catch (error) {
    console.warn(`thumbnail capture skipped for ${def.slug}:`, error);
  }
}

async function main() {
  await templatesRepository.deleteAll(db);
  for (const def of TEMPLATES) {
    // Sequential on purpose — `captureThumbnail` launches its own Chromium instance per call,
    // and this is a one-shot local seed script, not a hot path, so N templates racing N browsers
    // isn't worth the added complexity for readable, ordered console output as each one lands.
    // oxlint-disable-next-line no-await-in-loop
    await seedTemplate(def);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
