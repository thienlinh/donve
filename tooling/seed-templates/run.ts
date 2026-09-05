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
  },
  {
    slug: "khoa-hoc-online",
    name: "Khoá học Marketing Online",
    industry: "education",
    // Deep indigo + warm amber on a clean white surface — energetic but still readable for a
    // course sales page, distinct from beauty's sage/clay and fnb's terracotta/charcoal.
    tokens: {
      colorPrimary: "#1E2A5E",
      colorPrimaryForeground: "#F7F8FC",
      colorAccent: "#E0A526",
      colorAccentForeground: "#1E2A5E",
      colorSurface: "#FFFFFF",
      colorForeground: "#1B1D2A",
      colorMuted: "#666B80",
      colorBorder: "#E2E4EE",
      fontHeading: "Sora, sans-serif",
      fontBody: "Inter, sans-serif",
      radius: "0.5rem"
    },
    seo: {
      title: "Khoá học Marketing Online Từ Gốc Đến Chạy Ads — Học Viện AdWise",
      description:
        "Lộ trình marketing online 8 tuần từ nền tảng đến chạy quảng cáo thực chiến, có mentor kèm 1-1 và cam kết đầu ra. Đăng ký khai giảng đợt mới."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Học Viện AdWise",
          links: [
            { label: "Lộ trình học", href: "#curriculum" },
            { label: "Học phí", href: "#pricing" },
            { label: "Học viên nói gì", href: "#testimonials" }
          ],
          ctaLabel: "Đăng ký ngay",
          ctaHref: "#enroll",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA đăng ký luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline:
            "Từ chưa biết gì đến tự chạy được quảng cáo sinh lời sau 8 tuần",
          subheadline:
            "Lộ trình marketing online thực chiến, có mentor kèm 1-1 chữa bài từng buổi — đăng ký nhận ưu đãi khai giảng đợt tháng này.",
          ctaLabel: "Đăng ký khai giảng",
          ctaHref: "#enroll",
          secondaryCtaLabel: "Xem lộ trình học",
          secondaryCtaHref: "#curriculum",
          image: placeholderImage(
            "Học viên học marketing online cùng mentor",
            "E0A526"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold: kết quả cụ thể (tự chạy được ads) thay vì liệt kê chương trình học."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "1.200+ học viên đã tốt nghiệp" },
            { label: "Mentor có kinh nghiệm chạy ads thực chiến 6+ năm" },
            { label: "Cam kết hỗ trợ đến khi chạy được chiến dịch đầu tiên" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Số liệu + cam kết xoá lo ngại 'học xong có làm được không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Bạn nhận được gì sau khoá học",
          items: [
            {
              title: "Tự lên được chiến lược marketing",
              description:
                "Biết cách chọn kênh, ngân sách và mục tiêu phù hợp cho từng loại sản phẩm."
            },
            {
              title: "Tự chạy được quảng cáo Facebook/TikTok",
              description:
                "Thực hành trên tài khoản thật, không chỉ học lý thuyết trên slide."
            },
            {
              title: "Đọc được số liệu và tối ưu chiến dịch",
              description:
                "Biết chỉ số nào quan trọng, khi nào nên tắt/tăng ngân sách quảng cáo."
            },
            {
              title: "Có mentor kèm 1-1 chữa bài",
              description:
                "Mỗi buổi thực hành đều được mentor xem và góp ý trực tiếp, không học một mình."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason: "Nêu rõ kết quả đầu ra thay vì liệt kê tên bài học khô khan."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Không khí lớp học",
          images: [
            placeholderImage("Buổi học trực tuyến cùng mentor", "F0DDA6"),
            placeholderImage("Học viên thực hành chạy quảng cáo", "E6C87A"),
            placeholderImage("Buổi chữa bài 1-1 với mentor", "D9B45C"),
            placeholderImage("Lễ tốt nghiệp học viên khoá trước", "F0DDA6")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason:
            "Hình ảnh thật về không khí học giúp khách hình dung trải nghiệm."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Học viên nói gì",
          items: [
            {
              quote:
                "Sau 8 tuần mình tự chạy được chiến dịch đầu tiên cho shop online của gia đình, doanh thu tăng 40% chỉ trong tháng đầu.",
              authorName: "Nguyễn Thu Trang",
              authorTitle: "Chủ shop thời trang online",
              evidenceRef: "testimonial-khoahoc-1"
            },
            {
              quote:
                "Mentor chữa bài rất kỹ, không phải kiểu học xong quên ngay — mình áp dụng được luôn vào công việc marketing hiện tại.",
              authorName: "Phạm Đức Anh",
              authorTitle: "Nhân viên marketing",
              evidenceRef: "testimonial-khoahoc-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason:
            "Trích dẫn học viên thật kèm kết quả cụ thể, mỗi quote có evidenceRef."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Chọn gói học phù hợp",
          plans: [
            {
              name: "Tự học video",
              price: "1.490.000đ",
              period: "trọn khoá",
              features: [
                "Toàn bộ video bài giảng",
                "Tài liệu và template thực hành",
                "Truy cập trọn đời"
              ],
              ctaLabel: "Đăng ký",
              ctaHref: "#enroll",
              highlighted: false
            },
            {
              name: "Học + hỗ trợ Q&A",
              price: "2.990.000đ",
              period: "trọn khoá",
              features: [
                "Toàn bộ nội dung gói Tự học video",
                "Nhóm hỏi đáp riêng cùng trợ giảng",
                "Chấm bài thực hành hàng tuần",
                "Chứng chỉ hoàn thành"
              ],
              ctaLabel: "Đăng ký ngay",
              ctaHref: "#enroll",
              highlighted: true
            },
            {
              name: "Mentor 1-1",
              price: "5.990.000đ",
              period: "trọn khoá",
              features: [
                "Toàn bộ nội dung gói Q&A",
                "Mentor kèm 1-1 chữa bài mỗi tuần",
                "Chạy thử chiến dịch thật cùng mentor",
                "Ưu tiên hỗ trợ 3 tháng sau khi học xong"
              ],
              ctaLabel: "Liên hệ tư vấn",
              ctaHref: "#enroll",
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
              question: "Mình chưa biết gì về marketing có học được không?",
              answer:
                "Có — lộ trình bắt đầu từ nền tảng, không yêu cầu kiến thức trước, phù hợp cho người mới bắt đầu hoàn toàn."
            },
            {
              question:
                "Học bao lâu thì áp dụng được vào công việc/kinh doanh thật?",
              answer:
                "Đa số học viên bắt đầu thực hành trên tài khoản thật từ tuần thứ 3 và có thể tự chạy chiến dịch đầu tiên khi kết thúc khoá học."
            },
            {
              question: "Có được hỗ trợ gì sau khi học xong không?",
              answer:
                "Gói Mentor 1-1 được ưu tiên hỗ trợ thêm 3 tháng sau khoá học; các gói khác vẫn được tham gia nhóm cộng đồng học viên để hỏi đáp."
            },
            {
              question:
                "Học phí này có đáng so với tự học miễn phí trên mạng không?",
              answer:
                "Tự học miễn phí thường thiếu lộ trình rõ ràng và không có ai chữa bài — khoá học này rút ngắn thời gian mò mẫm bằng lộ trình có kiểm chứng và mentor đồng hành."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 4 băn khoăn phổ biến nhất trước khi đăng ký."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đăng ký khai giảng đợt mới",
          submitLabel: "Xác nhận đăng ký",
          showEmail: true,
          showPersona: true,
          personaOptions: ["Mới bắt đầu", "Đã có nền tảng", "Muốn nâng cao"],
          consentText: "Tôi đồng ý được liên hệ tư vấn về khoá học",
          variant: "inline_progressive"
        },
        note: {
          purpose: "action",
          reason: "Form đăng ký chính — điểm chuyển đổi của toàn trang."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Học Viện AdWise",
          links: [
            { label: "Lộ trình học", href: "#curriculum" },
            { label: "Học phí", href: "#pricing" },
            { label: "Đăng ký", href: "#enroll" }
          ],
          copyrightText: "© 2026 Học Viện AdWise",
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
    slug: "coaching-tu-van-1-1",
    name: "Coach Tài chính Cá nhân 1-1",
    industry: "other",
    // Deep teal + soft gold on a warm off-white — calm, trustworthy tone for a 1-1 advisory
    // service, distinct from the course template's indigo/amber.
    tokens: {
      colorPrimary: "#123C3A",
      colorPrimaryForeground: "#F6F5EF",
      colorAccent: "#B8935A",
      colorAccentForeground: "#123C3A",
      colorSurface: "#F6F5EF",
      colorForeground: "#1C231F",
      colorMuted: "#6E7671",
      colorBorder: "#DCD9CC",
      fontHeading: "Lora, serif",
      fontBody: "Nunito Sans, sans-serif",
      radius: "0.65rem"
    },
    seo: {
      title: "Coach Tài chính Cá nhân 1-1 — Minh Khuê Advisory",
      description:
        "Đồng hành 1-1 giúp bạn thoát khỏi vòng lặp chi tiêu không kiểm soát, xây kế hoạch tài chính rõ ràng theo đúng hoàn cảnh của bạn."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Minh Khuê Advisory",
          links: [
            { label: "Về coach", href: "#about" },
            { label: "Gói coaching", href: "#pricing" },
            { label: "Học viên nói gì", href: "#testimonials" }
          ],
          ctaLabel: "Đặt lịch tư vấn",
          ctaHref: "#booking",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA đặt lịch luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline:
            "Ngừng loay hoay một mình với tiền bạc — có người đồng hành đúng hướng",
          subheadline:
            "Coaching tài chính cá nhân 1-1, xây kế hoạch rõ ràng theo đúng thu nhập và mục tiêu của riêng bạn, không phải công thức chung chung.",
          ctaLabel: "Đặt buổi tư vấn đầu tiên",
          ctaHref: "#booking",
          secondaryCtaLabel: "Xem các gói coaching",
          secondaryCtaHref: "#pricing",
          image: placeholderImage(
            "Buổi coaching tài chính 1-1 với Minh Khuê",
            "B8935A"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold đánh vào nỗi đau 'loay hoay một mình' thay vì giới thiệu chung về coach."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Chứng chỉ CFP hoạch định tài chính cá nhân" },
            { label: "7+ năm tư vấn tài chính 1-1" },
            { label: "300+ khách hàng đã đồng hành" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Chứng chỉ + số liệu xoá lo ngại 'liệu coach có đủ chuyên môn không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Bạn nhận được gì khi đồng hành cùng coach",
          items: [
            {
              title: "Bức tranh tài chính rõ ràng",
              description:
                "Hiểu chính xác dòng tiền của mình đang đi đâu, thay vì chi tiêu theo cảm tính."
            },
            {
              title: "Kế hoạch phù hợp hoàn cảnh riêng",
              description:
                "Không áp dụng công thức chung — kế hoạch xây riêng theo thu nhập và mục tiêu của bạn."
            },
            {
              title: "Có người đồng hành, không đơn độc",
              description:
                "Mỗi buổi coaching là một bước tiến được theo dõi sát, không tự mày mò một mình."
            },
            {
              title: "Thói quen tài chính bền vững",
              description:
                "Xây thói quen tiết kiệm/đầu tư duy trì được lâu dài, không chỉ nhất thời."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason:
            "Nêu rõ lợi ích cụ thể nhận được, không chỉ mô tả 'dịch vụ coaching'."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Không gian buổi coaching",
          images: [
            placeholderImage(
              "Buổi coaching trực tiếp tại phòng tư vấn",
              "D9C7A3"
            ),
            placeholderImage("Buổi coaching online qua video call", "CBB98C"),
            placeholderImage(
              "Tài liệu kế hoạch tài chính cá nhân hoá",
              "BDA974"
            ),
            placeholderImage("Góc làm việc của coach Minh Khuê", "D9C7A3")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason:
            "Hình ảnh thật giúp khách hình dung buổi coaching diễn ra thế nào."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Khách hàng nói gì",
          items: [
            {
              quote:
                "Sau 4 buổi coaching mình đã có quỹ dự phòng đầu tiên trong đời — điều mà tự đọc sách tài chính 2 năm trước mình chưa làm được.",
              authorName: "Đỗ Thanh Hà",
              authorTitle: "Nhân viên văn phòng",
              evidenceRef: "testimonial-coaching-1"
            },
            {
              quote:
                "Coach hỏi rất đúng trọng tâm, giúp mình nhìn ra vấn đề chi tiêu mà bản thân không tự nhận ra được.",
              authorName: "Vũ Hoàng Nam",
              authorTitle: "Chủ cửa hàng nhỏ",
              evidenceRef: "testimonial-coaching-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason:
            "Trích dẫn khách thật kèm kết quả cụ thể, mỗi quote có evidenceRef."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Chọn gói coaching phù hợp",
          plans: [
            {
              name: "Buổi trải nghiệm",
              price: "690.000đ",
              period: "1 buổi (60 phút)",
              features: [
                "Đánh giá tổng quan tình hình tài chính",
                "Xác định 1-2 vấn đề ưu tiên xử lý trước",
                "Bản ghi chú hành động sau buổi"
              ],
              ctaLabel: "Đặt buổi trải nghiệm",
              ctaHref: "#booking",
              highlighted: false
            },
            {
              name: "Gói 4 buổi",
              price: "2.390.000đ",
              period: "4 buổi trong 1 tháng",
              features: [
                "Xây kế hoạch tài chính cá nhân hoá",
                "Theo dõi tiến độ hàng tuần",
                "Hỗ trợ nhắn tin giữa các buổi"
              ],
              ctaLabel: "Đăng ký gói 4 buổi",
              ctaHref: "#booking",
              highlighted: true
            },
            {
              name: "Gói 8 buổi đồng hành",
              price: "4.290.000đ",
              period: "8 buổi trong 2-3 tháng",
              features: [
                "Toàn bộ nội dung gói 4 buổi",
                "Đồng hành đến khi thói quen tài chính ổn định",
                "Điều chỉnh kế hoạch theo tình huống phát sinh thực tế"
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
          reason: "3 mức giá theo số buổi, gói giữa được đề xuất (highlighted)."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question: "Thu nhập của mình thấp thì coaching có phù hợp không?",
              answer:
                "Có — kế hoạch được xây theo đúng thu nhập thực tế của bạn, không yêu cầu thu nhập cao mới áp dụng được."
            },
            {
              question: "Bao lâu thì thấy thay đổi rõ rệt?",
              answer:
                "Đa số khách hàng có bức tranh tài chính rõ ràng ngay sau buổi đầu tiên, và thấy thay đổi thói quen chi tiêu sau 3-4 buổi."
            },
            {
              question:
                "Coaching này có phù hợp với hoàn cảnh riêng của mình không?",
              answer:
                "Buổi trải nghiệm đầu tiên chính là để đánh giá đúng hoàn cảnh của bạn trước khi đề xuất gói phù hợp — không áp một kế hoạch có sẵn cho mọi người."
            },
            {
              question: "Sau khi hết gói có được hỗ trợ gì thêm không?",
              answer:
                "Có thể đặt thêm buổi lẻ hoặc gia hạn đồng hành nếu cần điều chỉnh kế hoạch theo tình huống mới phát sinh."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 4 băn khoăn phổ biến nhất trước khi đặt lịch."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đặt buổi coaching đầu tiên",
          submitLabel: "Xác nhận đặt lịch",
          showEmail: true,
          showPersona: false,
          consentText: "Tôi đồng ý được liên hệ để sắp xếp buổi coaching",
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
          logoText: "Minh Khuê Advisory",
          links: [
            { label: "Về coach", href: "#about" },
            { label: "Gói coaching", href: "#pricing" },
            { label: "Đặt lịch", href: "#booking" }
          ],
          copyrightText: "© 2026 Minh Khuê Advisory",
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
    slug: "workshop-su-kien",
    name: "Workshop Kỹ năng Thuyết trình",
    industry: "other",
    // Bold violet + bright coral on near-black — energetic, event-poster feel distinct from the
    // calmer palettes above.
    tokens: {
      colorPrimary: "#4C1D95",
      colorPrimaryForeground: "#FBF8FF",
      colorAccent: "#F2554C",
      colorAccentForeground: "#FBF8FF",
      colorSurface: "#FBF8FF",
      colorForeground: "#1A1524",
      colorMuted: "#6B637A",
      colorBorder: "#E4DCF5",
      fontHeading: "Space Grotesk, sans-serif",
      fontBody: "Inter, sans-serif",
      radius: "0.5rem"
    },
    seo: {
      title: "Workshop Kỹ năng Thuyết trình Tự Tin — 20/09/2026",
      description:
        "Workshop 1 ngày rèn kỹ năng thuyết trình tự tin trước đám đông, thực hành trực tiếp cùng chuyên gia. Chỉ còn số lượng chỗ giới hạn."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "SpeakUp Workshop",
          links: [
            { label: "Lịch trình", href: "#schedule" },
            { label: "Diễn giả", href: "#speakers" },
            { label: "Học phí", href: "#pricing" }
          ],
          ctaLabel: "Đăng ký tham dự",
          ctaHref: "#register",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA đăng ký luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline:
            "Tự tin thuyết trình trước đám đông chỉ sau 1 ngày thực hành",
          subheadline:
            "Workshop trực tiếp tại TP.HCM, 09:00 - 17:00 ngày 20/09/2026 — thực hành thuyết trình thật, có chuyên gia phản hồi trực tiếp. Số chỗ giới hạn 40 người.",
          ctaLabel: "Đăng ký giữ chỗ",
          ctaHref: "#register",
          secondaryCtaLabel: "Xem lịch trình",
          secondaryCtaHref: "#schedule",
          image: placeholderImage(
            "Học viên thực hành thuyết trình tại workshop",
            "F2554C"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Nêu ngay ngày giờ, địa điểm và kết quả cụ thể ở above-the-fold."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Diễn giả từng đào tạo 5.000+ học viên" },
            { label: "Thực hành trực tiếp, không chỉ nghe giảng" },
            { label: "4.9/5 đánh giá từ các khoá trước" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Uy tín diễn giả xoá lo ngại 'workshop có đáng thời gian bỏ ra không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Vì sao nên tham dự",
          items: [
            {
              title: "Thực hành ngay tại chỗ",
              description:
                "Mỗi học viên thuyết trình ít nhất 2 lần trong ngày, có phản hồi trực tiếp từ chuyên gia."
            },
            {
              title: "Kỹ thuật kiểm soát run/lo lắng",
              description:
                "Học cách kiểm soát giọng nói, ngôn ngữ cơ thể khi đứng trước đám đông."
            },
            {
              title: "Nhóm nhỏ, sát sao",
              description:
                "Giới hạn 40 người để mỗi học viên đều được góp ý riêng, không phải hội thảo đại trà."
            },
            {
              title: "Tài liệu mang về áp dụng ngay",
              description:
                "Bộ khung chuẩn bị bài thuyết trình dùng lại được cho công việc sau workshop."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason:
            "Nêu rõ lợi ích 'vì sao nên tham dự' thay vì mô tả chung chung."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Không khí workshop khoá trước",
          images: [
            placeholderImage("Học viên thuyết trình trước lớp", "E4DCF5"),
            placeholderImage("Chuyên gia hướng dẫn trực tiếp", "D5C4EF"),
            placeholderImage("Hoạt động nhóm thực hành", "C6ABE8"),
            placeholderImage("Không gian tổ chức workshop", "E4DCF5")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason:
            "Hình ảnh thật từ khoá trước giúp khách hình dung buổi workshop."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Học viên khoá trước nói gì",
          items: [
            {
              quote:
                "Trước đây mình run đến mức quên hết nội dung, sau workshop mình đã tự tin thuyết trình trước cả phòng họp công ty.",
              authorName: "Bùi Anh Thư",
              authorTitle: "Chuyên viên nhân sự",
              evidenceRef: "testimonial-workshop-1"
            },
            {
              quote:
                "Chỉ 1 ngày nhưng lượng thực hành cực nhiều, phản hồi của chuyên gia rất cụ thể chứ không chung chung.",
              authorName: "Trịnh Minh Đức",
              authorTitle: "Trưởng nhóm kinh doanh",
              evidenceRef: "testimonial-workshop-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason:
            "Trích dẫn học viên thật kèm kết quả cụ thể, mỗi quote có evidenceRef."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Học phí tham dự",
          plans: [
            {
              name: "Early bird",
              price: "890.000đ",
              period: "đăng ký trước 10/09",
              features: [
                "Tham dự trọn ngày workshop",
                "Tài liệu khung thuyết trình",
                "Chứng nhận tham dự"
              ],
              ctaLabel: "Đăng ký early bird",
              ctaHref: "#register",
              highlighted: true
            },
            {
              name: "Giá thường",
              price: "1.290.000đ",
              period: "đăng ký sau 10/09",
              features: [
                "Tham dự trọn ngày workshop",
                "Tài liệu khung thuyết trình",
                "Chứng nhận tham dự"
              ],
              ctaLabel: "Đăng ký",
              ctaHref: "#register",
              highlighted: false
            },
            {
              name: "Nhóm 3 người",
              price: "2.190.000đ",
              period: "trọn ngày / 3 người",
              features: [
                "Áp dụng giá early bird cho cả nhóm",
                "Ngồi cùng bàn thực hành nhóm",
                "Tiết kiệm hơn đăng ký lẻ"
              ],
              ctaLabel: "Đăng ký theo nhóm",
              ctaHref: "#register",
              highlighted: false
            }
          ],
          variant: "3_tier"
        },
        note: {
          purpose: "action",
          reason:
            "Giá early bird được đóng khung đề xuất (highlighted) để thúc đẩy đăng ký sớm."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question:
                "Mình chưa từng thuyết trình bao giờ có tham dự được không?",
              answer:
                "Được — workshop thiết kế cho cả người mới bắt đầu, bài tập thực hành có nhiều cấp độ khác nhau."
            },
            {
              question: "Có cần chuẩn bị bài thuyết trình trước không?",
              answer:
                "Không bắt buộc — bạn sẽ được hướng dẫn xây bài thuyết trình ngắn ngay tại workshop."
            },
            {
              question: "Nếu bận đột xuất không tham dự được thì sao?",
              answer:
                "Có thể chuyển nhượng vé cho người khác hoặc bảo lưu sang khoá kế tiếp, liên hệ trước ngày diễn ra ít nhất 3 ngày."
            },
            {
              question: "Học phí này có bao gồm tài liệu và chứng nhận không?",
              answer:
                "Có — mọi học viên đều nhận tài liệu khung thuyết trình và chứng nhận tham dự sau khi kết thúc workshop."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 4 băn khoăn phổ biến nhất trước khi đăng ký."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đăng ký tham dự — chỉ còn số lượng chỗ giới hạn",
          submitLabel: "Xác nhận đăng ký",
          showEmail: true,
          showPersona: true,
          personaOptions: ["Trực tiếp tại địa điểm", "Tham dự online"],
          consentText: "Tôi đồng ý được liên hệ để xác nhận đăng ký tham dự",
          variant: "inline_progressive"
        },
        note: {
          purpose: "action",
          reason: "Form đăng ký chính — điểm chuyển đổi của toàn trang."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "SpeakUp Workshop",
          links: [
            { label: "Lịch trình", href: "#schedule" },
            { label: "Diễn giả", href: "#speakers" },
            { label: "Đăng ký", href: "#register" }
          ],
          copyrightText: "© 2026 SpeakUp Workshop",
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
    slug: "dich-vu-dat-lich",
    name: "Phòng khám Nha khoa (Đặt lịch)",
    industry: "other",
    // Clean clinical blue + mint on white — trustworthy/medical tone, distinct from every
    // other palette above.
    tokens: {
      colorPrimary: "#0B4F6C",
      colorPrimaryForeground: "#F4FBFA",
      colorAccent: "#3FA796",
      colorAccentForeground: "#0B4F6C",
      colorSurface: "#F4FBFA",
      colorForeground: "#152B2E",
      colorMuted: "#5C7377",
      colorBorder: "#D6E9E6",
      fontHeading: "Manrope, sans-serif",
      fontBody: "Source Sans 3, sans-serif",
      radius: "0.75rem"
    },
    seo: {
      title: "Phòng khám Nha khoa Việt Tâm — Đặt lịch khám online",
      description:
        "Khám và điều trị nha khoa tổng quát, niềng răng, cấy ghép Implant. Đặt lịch online nhanh chóng, chọn khung giờ trống phù hợp với bạn."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Nha khoa Việt Tâm",
          links: [
            { label: "Dịch vụ", href: "#services" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Đánh giá", href: "#testimonials" }
          ],
          ctaLabel: "Đặt lịch khám",
          ctaHref: "#booking",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA đặt lịch luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline:
            "Đặt lịch khám nha khoa online — không cần gọi điện chờ đợi",
          subheadline:
            "Khám tổng quát, niềng răng, cấy ghép Implant cùng bác sĩ có chứng chỉ quốc tế — chọn khung giờ trống phù hợp, xác nhận trong ngày.",
          ctaLabel: "Đặt lịch khám ngay",
          ctaHref: "#booking",
          secondaryCtaLabel: "Xem bảng giá dịch vụ",
          secondaryCtaHref: "#pricing",
          image: placeholderImage(
            "Phòng khám nha khoa Việt Tâm hiện đại",
            "3FA796"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold nhấn mạnh sự tiện lợi (đặt online, không chờ) và độ tin cậy chuyên môn."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Bác sĩ chứng chỉ Implant quốc tế" },
            { label: "Trang thiết bị vô trùng đạt chuẩn Bộ Y tế" },
            { label: "4.9/5 trên 2.000+ lượt đánh giá" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Chứng chỉ + số liệu xoá lo ngại 'liệu tay nghề bác sĩ có đảm bảo không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Dịch vụ nha khoa chính",
          items: [
            {
              title: "Khám & vệ sinh răng miệng tổng quát",
              description:
                "Kiểm tra định kỳ, lấy cao răng, phát hiện sớm các vấn đề răng miệng."
            },
            {
              title: "Niềng răng chỉnh nha",
              description:
                "Tư vấn phác đồ niềng phù hợp, theo dõi tiến độ sát sao mỗi lần tái khám."
            },
            {
              title: "Cấy ghép Implant",
              description:
                "Phục hồi răng mất bằng công nghệ Implant chuẩn quốc tế, độ bền cao."
            },
            {
              title: "Tẩy trắng răng an toàn",
              description:
                "Công nghệ tẩy trắng không ê buốt, thấy hiệu quả sau 1 lần."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason:
            "Liệt kê rõ 4 dịch vụ chính để khách hiểu phòng khám làm được gì."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Không gian phòng khám",
          images: [
            placeholderImage("Phòng khám nha khoa vô trùng", "D6E9E6"),
            placeholderImage("Khu vực tiếp đón bệnh nhân", "C4E2DC"),
            placeholderImage("Phòng điều trị Implant", "B2DBD2"),
            placeholderImage("Trang thiết bị nha khoa hiện đại", "D6E9E6")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason: "Không gian thật giúp khách yên tâm trước khi đặt lịch khám."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Bệnh nhân nói gì",
          items: [
            {
              quote:
                "Đặt lịch online nhanh, không phải chờ đợi lâu như trước — bác sĩ tư vấn rất kỹ trước khi làm Implant.",
              authorName: "Hoàng Thị Mai",
              authorTitle: "Bệnh nhân điều trị Implant",
              evidenceRef: "testimonial-datlich-1"
            },
            {
              quote:
                "Con mình niềng răng ở đây 18 tháng, bác sĩ theo dõi sát từng đợt tái khám, kết quả rất ưng ý.",
              authorName: "Phan Văn Lộc",
              authorTitle: "Phụ huynh bệnh nhân niềng răng",
              evidenceRef: "testimonial-datlich-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason:
            "Trích dẫn bệnh nhân thật kèm kết quả cụ thể, mỗi quote có evidenceRef."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Bảng giá dịch vụ tham khảo",
          plans: [
            {
              name: "Khám & tư vấn",
              price: "Miễn phí",
              period: "buổi đầu tiên",
              features: [
                "Khám tổng quát răng miệng",
                "Chụp X-quang đánh giá ban đầu",
                "Tư vấn phác đồ điều trị phù hợp"
              ],
              ctaLabel: "Đặt lịch khám",
              ctaHref: "#booking",
              highlighted: false
            },
            {
              name: "Liệu trình niềng răng",
              price: "35.000.000đ",
              period: "trọn liệu trình",
              features: [
                "Niềng răng mắc cài kim loại/sứ",
                "Tái khám định kỳ theo phác đồ",
                "Hàm duy trì sau khi tháo niềng"
              ],
              ctaLabel: "Đặt lịch tư vấn",
              ctaHref: "#booking",
              highlighted: true
            },
            {
              name: "Cấy ghép Implant",
              price: "Từ 18.000.000đ",
              period: "mỗi trụ Implant",
              features: [
                "Trụ Implant chuẩn quốc tế",
                "Phẫu thuật cấy ghép & phục hình",
                "Bảo hành theo chính sách hãng"
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
          reason:
            "3 mức dịch vụ rõ ràng, gói niềng răng được đề xuất (highlighted)."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question: "Đặt lịch online có mất phí gì không?",
              answer:
                "Không — đặt lịch online hoàn toàn miễn phí, buổi khám & tư vấn đầu tiên cũng miễn phí."
            },
            {
              question: "Niềng răng/Implant mất bao lâu mới xong?",
              answer:
                "Niềng răng thường 12-24 tháng tuỳ tình trạng, cấy Implant thường 3-6 tháng bao gồm thời gian lành xương — bác sĩ sẽ tư vấn thời gian cụ thể sau khi khám."
            },
            {
              question: "Trường hợp của mình có phù hợp làm Implant không?",
              answer:
                "Cần khám và chụp X-quang trực tiếp mới xác định chính xác — buổi khám đầu tiên miễn phí là bước để bác sĩ đánh giá đúng tình trạng của bạn."
            },
            {
              question: "Sau điều trị có được hỗ trợ tái khám không?",
              answer:
                "Có — mọi liệu trình đều bao gồm lịch tái khám định kỳ theo dõi, không phát sinh thêm phí tái khám trong phác đồ đã tư vấn."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 4 băn khoăn phổ biến nhất trước khi đặt lịch."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đặt lịch khám tại Nha khoa Việt Tâm",
          submitLabel: "Xác nhận đặt lịch",
          showEmail: true,
          showPersona: false,
          consentText: "Tôi đồng ý được liên hệ để xác nhận lịch khám",
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
          logoText: "Nha khoa Việt Tâm",
          links: [
            { label: "Dịch vụ", href: "#services" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Đặt lịch", href: "#booking" }
          ],
          copyrightText: "© 2026 Nha khoa Việt Tâm",
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
    slug: "saas-quan-ly-cong-viec",
    name: "SaaS Quản lý Công việc (Orbiq)",
    industry: "saas",
    // Deep ink navy + warm amber on cool off-white — confident product-led tone, distinct from
    // every warm/organic palette above (this gallery's first `saas` entry).
    tokens: {
      colorPrimary: "#12203A",
      colorPrimaryForeground: "#F6F7FB",
      colorAccent: "#F2A93B",
      colorAccentForeground: "#12203A",
      colorSurface: "#F6F7FB",
      colorForeground: "#12131A",
      colorMuted: "#5B6472",
      colorBorder: "#E1E4EC",
      fontHeading: "Urbanist, sans-serif",
      fontBody: "Public Sans, sans-serif",
      radius: "0.375rem"
    },
    seo: {
      title: "Orbiq — Quản lý công việc nhóm gọn gàng, không rối task",
      description:
        "Orbiq gom task, tiến độ và giao tiếp nhóm vào một bảng làm việc duy nhất. Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Orbiq",
          links: [
            { label: "Tính năng", href: "#features" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Khách hàng", href: "#testimonials" }
          ],
          ctaLabel: "Dùng thử miễn phí",
          ctaHref: "#signup",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA dùng thử luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero_video",
        props: {
          headline: "Quản lý công việc nhóm mà không cần 5 công cụ khác nhau",
          subheadline:
            "Orbiq gom task, tiến độ và giao tiếp nhóm vào một bảng làm việc duy nhất — xem demo 60 giây bên dưới.",
          ctaLabel: "Dùng thử miễn phí 14 ngày",
          ctaHref: "#signup",
          secondaryCtaLabel: "Xem bảng giá",
          embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          variant: "youtube"
        },
        note: {
          purpose: "desire",
          reason:
            "Video demo sản phẩm ngay above-the-fold thuyết phục nhanh hơn ảnh tĩnh cho SaaS."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "2.400+ đội nhóm đang dùng Orbiq" },
            { label: "Uptime 99.9% 12 tháng liên tiếp" },
            { label: "Không cần thẻ tín dụng để dùng thử" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Số liệu vận hành xoá lo ngại 'liệu công cụ có ổn định không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Mọi thứ đội nhóm cần trong một nơi",
          items: [
            {
              title: "Bảng công việc kéo-thả",
              description:
                "Sắp xếp task theo trạng thái, ưu tiên và người phụ trách chỉ trong vài giây."
            },
            {
              title: "Tự động hoá quy trình lặp lại",
              description:
                "Đặt luật tự động chuyển trạng thái, gán việc và nhắc hạn — không cần thao tác tay."
            },
            {
              title: "Báo cáo tiến độ theo thời gian thực",
              description:
                "Nhìn ngay tiến độ dự án và điểm nghẽn mà không cần họp cập nhật riêng."
            },
            {
              title: "Tích hợp công cụ đang dùng",
              description:
                "Kết nối Slack, Google Calendar và email nhóm — không cần đổi thói quen làm việc."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason: "Nêu rõ 4 nhóm tính năng chính thay vì liệt kê danh sách dài."
        }
      },
      {
        type: "blog_article_grid",
        props: {
          heading: "Tài nguyên cho đội nhóm vận hành hiệu quả",
          articles: [
            {
              title: "5 dấu hiệu team đang quản lý task sai cách",
              excerpt:
                "Những dấu hiệu phổ biến cho thấy quy trình quản lý công việc đang cản trở tốc độ của team.",
              image: placeholderImage(
                "Đội nhóm họp bàn quy trình làm việc",
                "DCE6F5"
              ),
              href: "#blog/dau-hieu-quan-ly-task-sai-cach",
              tag: "Vận hành",
              date: "10/08/2026"
            },
            {
              title: "Tự động hoá quy trình duyệt việc trong 10 phút",
              excerpt:
                "Hướng dẫn thiết lập luật tự động để giảm thời gian chờ duyệt task giữa các phòng ban.",
              image: placeholderImage(
                "Màn hình thiết lập tự động hoá quy trình",
                "C7D7EE"
              ),
              href: "#blog/tu-dong-hoa-quy-trinh-duyet-viec",
              tag: "Hướng dẫn",
              date: "28/07/2026"
            },
            {
              title: "Case study: Rút ngắn 30% thời gian giao dự án",
              excerpt:
                "Một agency 40 người chia sẻ cách họ tổ chức lại quy trình quản lý dự án với Orbiq.",
              image: placeholderImage(
                "Đội nhóm agency làm việc cùng nhau",
                "B7C9E8"
              ),
              href: "#blog/case-study-rut-ngan-thoi-gian-giao-du-an",
              tag: "Case study",
              date: "15/07/2026"
            }
          ],
          variant: "grid_3col"
        },
        note: {
          purpose: "understanding",
          reason:
            "Nội dung chuyên môn chứng minh Orbiq hiểu đúng vấn đề vận hành của khách hàng."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Đội nhóm đang dùng Orbiq nói gì",
          items: [
            {
              quote:
                "Chuyển từ 3 công cụ rời rạc sang Orbiq, team mình họp cập nhật tiến độ ít hẳn đi vì ai cũng nhìn thấy bảng chung.",
              authorName: "Hoàng Gia Bảo",
              authorTitle: "Trưởng phòng vận hành, công ty logistics",
              evidenceRef: "testimonial-saas-1"
            },
            {
              quote:
                "Tính năng tự động hoá giúp team mình bỏ được hẳn quy trình duyệt việc thủ công qua email.",
              authorName: "Lâm Thảo Vy",
              authorTitle: "Quản lý dự án, agency marketing",
              evidenceRef: "testimonial-saas-2"
            }
          ],
          variant: "grid"
        },
        note: {
          purpose: "proof",
          reason:
            "Trích dẫn khách thật kèm bối cảnh cụ thể, mỗi quote có evidenceRef."
        }
      },
      {
        type: "pricing_table",
        props: {
          heading: "Chọn gói phù hợp quy mô đội nhóm",
          plans: [
            {
              name: "Starter",
              price: "0đ",
              period: "tháng, tối đa 5 người",
              features: [
                "Bảng công việc không giới hạn",
                "3 tự động hoá quy trình",
                "Hỗ trợ qua email"
              ],
              ctaLabel: "Bắt đầu miễn phí",
              ctaHref: "#signup",
              highlighted: false
            },
            {
              name: "Team",
              price: "199.000đ",
              period: "người/tháng",
              features: [
                "Toàn bộ tính năng gói Starter",
                "Tự động hoá không giới hạn",
                "Báo cáo tiến độ nâng cao",
                "Tích hợp Slack & Calendar"
              ],
              ctaLabel: "Dùng thử 14 ngày",
              ctaHref: "#signup",
              highlighted: true
            },
            {
              name: "Doanh nghiệp",
              price: "Liên hệ",
              period: "theo nhu cầu",
              features: [
                "Toàn bộ tính năng gói Team",
                "SSO & phân quyền nâng cao",
                "Quản lý tài khoản riêng"
              ],
              ctaLabel: "Liên hệ tư vấn",
              ctaHref: "#signup",
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
              question: "Team dưới 5 người có cần trả phí không?",
              answer:
                "Không — gói Starter miễn phí vĩnh viễn cho team tối đa 5 người, không giới hạn thời gian dùng thử."
            },
            {
              question: "Có cần thẻ tín dụng để dùng thử gói Team không?",
              answer:
                "Không cần — bạn có thể dùng thử đầy đủ tính năng gói Team trong 14 ngày mà không cần nhập thẻ tín dụng."
            },
            {
              question: "Dữ liệu công ty mình có an toàn không?",
              answer:
                "Dữ liệu được mã hoá khi lưu trữ và truyền tải, sao lưu hàng ngày, tuân thủ các tiêu chuẩn bảo mật phổ biến."
            },
            {
              question: "Chuyển dữ liệu từ công cụ cũ sang có khó không?",
              answer:
                "Orbiq hỗ trợ nhập dữ liệu từ file CSV và các công cụ quản lý task phổ biến, đội ngũ hỗ trợ sẽ đồng hành trong quá trình chuyển đổi."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason: "Trả lời trước 4 băn khoăn phổ biến nhất trước khi đăng ký."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Bắt đầu dùng thử Orbiq miễn phí",
          submitLabel: "Tạo tài khoản dùng thử",
          showEmail: true,
          showPersona: true,
          personaOptions: [
            "Dưới 5 người",
            "5-20 người",
            "20-50 người",
            "50+ người"
          ],
          consentText: "Tôi đồng ý nhận thông tin sản phẩm qua email",
          variant: "inline_progressive"
        },
        note: {
          purpose: "action",
          reason:
            "Form đăng ký dùng thử — điểm chuyển đổi chính của toàn trang."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Orbiq",
          links: [
            { label: "Tính năng", href: "#features" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Đăng ký", href: "#signup" }
          ],
          copyrightText: "© 2026 Orbiq",
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
    slug: "thoi-trang-lume-atelier",
    name: "Thời trang Boutique (Lume Atelier)",
    industry: "ecommerce",
    // Warm near-black + brass gold on soft warm white — editorial boutique tone, distinct from
    // beauty's sage/clay and every other palette above (this gallery's first `ecommerce` entry).
    tokens: {
      colorPrimary: "#201B18",
      colorPrimaryForeground: "#FAF7F5",
      colorAccent: "#A98B4B",
      colorAccentForeground: "#201B18",
      colorSurface: "#FAF7F5",
      colorForeground: "#201B18",
      colorMuted: "#8A7A74",
      colorBorder: "#E8DEDA",
      fontHeading: "Bebas Neue, sans-serif",
      fontBody: "Karla, sans-serif",
      radius: "0.25rem"
    },
    seo: {
      title: "Lume Atelier — Thời trang boutique, chất liệu bền vững",
      description:
        "Bộ sưu tập thời trang nữ tối giản, chất liệu bền vững, đổi trả 30 ngày. Đăng ký nhận ưu đãi 10% cho đơn hàng đầu tiên."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Lume Atelier",
          links: [
            { label: "Bộ sưu tập", href: "#collection" },
            { label: "Về chúng tôi", href: "#about" },
            { label: "Đánh giá", href: "#testimonials" }
          ],
          ctaLabel: "Mua ngay",
          ctaHref: "#collection",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA mua hàng luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline: "Thời trang tối giản, may đo cho dáng người Việt",
          subheadline:
            "Chất liệu tự nhiên bền vững, thiết kế tinh giản mặc được lâu dài — đổi trả miễn phí trong 30 ngày.",
          ctaLabel: "Khám phá bộ sưu tập",
          ctaHref: "#collection",
          secondaryCtaLabel: "Về chúng tôi",
          secondaryCtaHref: "#about",
          image: placeholderImage(
            "Người mẫu mặc trang phục bộ sưu tập Lume Atelier",
            "A98B4B"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold: hình ảnh trang phục thật + lời hứa 'may đo cho dáng người Việt'."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "Đổi trả miễn phí trong 30 ngày" },
            { label: "Chất liệu tự nhiên, nguồn gốc rõ ràng" },
            { label: "Miễn phí giao hàng đơn từ 500.000đ" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Chính sách đổi trả xoá lo ngại phổ biến nhất khi mua thời trang online."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Vì sao chọn Lume Atelier",
          items: [
            {
              title: "May đo theo dáng người Việt",
              description:
                "Rập được điều chỉnh riêng, không rập nhập khẩu nguyên bản từ nước ngoài."
            },
            {
              title: "Chất liệu bền vững",
              description:
                "Vải lanh, cotton hữu cơ và tencel — thoáng mát, thân thiện môi trường."
            },
            {
              title: "Thiết kế mặc được lâu dài",
              description:
                "Form dáng tối giản, phối được nhiều dịp thay vì chỉ hợp trào lưu ngắn hạn."
            },
            {
              title: "Sản xuất số lượng giới hạn",
              description:
                "Mỗi mẫu chỉ sản xuất số lượng nhỏ, hạn chế tồn kho và lãng phí."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason:
            "Nêu rõ điểm khác biệt thay vì chỉ mô tả 'thời trang cao cấp'."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Bộ sưu tập mới nhất",
          images: [
            placeholderImage("Áo sơ mi lanh form rộng", "E8DEDA"),
            placeholderImage("Váy midi vải tencel", "D9CBB8"),
            placeholderImage("Set đồ công sở tối giản", "C9B48F"),
            placeholderImage("Phụ kiện đi kèm bộ sưu tập", "E8DEDA")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason:
            "Hình ảnh sản phẩm thật giúp khách hình dung chất liệu và form dáng."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Khách hàng nói gì",
          items: [
            {
              quote:
                "Vải mặc rất mát và không bị nhăn nhiều như mình lo, form áo đúng dáng người Việt hơn hẳn đồ mình từng mua online.",
              authorName: "Phan Ngọc Diễm",
              authorTitle: "Khách hàng",
              evidenceRef: "testimonial-ecommerce-1"
            },
            {
              quote:
                "Đổi size rất nhanh không rắc rối, nhân viên tư vấn nhiệt tình qua chat.",
              authorName: "Trịnh Bảo Ngọc",
              authorTitle: "Khách hàng thân thiết",
              evidenceRef: "testimonial-ecommerce-2"
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
          heading: "Gói thành viên Lume Circle",
          plans: [
            {
              name: "Thành viên thường",
              price: "Miễn phí",
              period: "khi đăng ký tài khoản",
              features: [
                "Tích điểm mỗi đơn hàng",
                "Thông báo sớm bộ sưu tập mới",
                "Ưu đãi sinh nhật"
              ],
              ctaLabel: "Đăng ký tài khoản",
              ctaHref: "#collection",
              highlighted: false
            },
            {
              name: "Lume Circle",
              price: "499.000đ",
              period: "năm",
              features: [
                "Toàn bộ quyền lợi Thành viên thường",
                "Giảm 15% mọi đơn hàng",
                "Miễn phí đổi trả không giới hạn lần",
                "Ưu tiên đặt trước bộ sưu tập giới hạn"
              ],
              ctaLabel: "Nâng cấp Lume Circle",
              ctaHref: "#collection",
              highlighted: true
            },
            {
              name: "Đối tác bán buôn",
              price: "Liên hệ",
              period: "theo số lượng",
              features: [
                "Giá sỉ theo số lượng đặt",
                "Hỗ trợ đặt hàng riêng theo mùa",
                "Tư vấn phối bộ sưu tập cho cửa hàng"
              ],
              ctaLabel: "Liên hệ hợp tác",
              ctaHref: "#about",
              highlighted: false
            }
          ],
          variant: "3_tier"
        },
        note: {
          purpose: "action",
          reason:
            "Gói membership giữa được đề xuất (highlighted) để thúc đẩy khách hàng trung thành."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question: "Làm sao chọn đúng size khi mua online?",
              answer:
                "Mỗi sản phẩm đều có bảng size chi tiết theo số đo cơ thể, kèm hướng dẫn cách đo tại nhà trong phần mô tả sản phẩm."
            },
            {
              question: "Đổi trả có mất phí không?",
              answer:
                "Đổi trả trong 30 ngày miễn phí với thành viên thường (áp dụng lần đầu), miễn phí không giới hạn với thành viên Lume Circle."
            },
            {
              question: "Giao hàng mất bao lâu?",
              answer:
                "Nội thành 1-2 ngày, các tỉnh thành khác 3-5 ngày làm việc kể từ khi xác nhận đơn hàng."
            },
            {
              question: "Chất liệu có phù hợp khí hậu nóng ẩm không?",
              answer:
                "Có — lanh, cotton hữu cơ và tencel đều thoáng khí, phù hợp mặc quanh năm ở khí hậu nhiệt đới."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Trả lời trước 4 băn khoăn phổ biến nhất khi mua thời trang online."
        }
      },
      {
        type: "cta_email_capture",
        props: {
          headline: "Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên",
          description:
            "Đăng ký để nhận mã giảm giá và thông tin bộ sưu tập mới sớm nhất.",
          nameLabel: "Họ và tên",
          emailLabel: "Email",
          ctaLabel: "Nhận mã ưu đãi",
          ctaHref: "#collection",
          helperText: "Mã giảm giá sẽ được gửi qua email trong vài phút.",
          variant: "card"
        },
        note: {
          purpose: "action",
          reason:
            "Thu thập email kèm ưu đãi cụ thể — điểm chuyển đổi chính cho khách chưa sẵn sàng mua ngay."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Lume Atelier",
          links: [
            { label: "Bộ sưu tập", href: "#collection" },
            { label: "Về chúng tôi", href: "#about" },
            { label: "Liên hệ", href: "#contact" }
          ],
          copyrightText: "© 2026 Lume Atelier",
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
    slug: "bat-dong-san-landmark",
    name: "Bất động sản (Landmark Realty)",
    industry: "real_estate",
    // Deep slate navy + warm rust on cool cream — trustworthy brochure tone, distinct from every
    // palette above (this gallery's first `real_estate` entry).
    tokens: {
      colorPrimary: "#26343F",
      colorPrimaryForeground: "#F5F8FA",
      colorAccent: "#A85C32",
      colorAccentForeground: "#F5F8FA",
      colorSurface: "#F6F4EF",
      colorForeground: "#23282B",
      colorMuted: "#6B7278",
      colorBorder: "#DCE1E3",
      fontHeading: "Libre Baskerville, serif",
      fontBody: "Barlow, sans-serif",
      radius: "0.375rem"
    },
    seo: {
      title: "Landmark Realty — Căn hộ và nhà phố khu Đông TP.HCM",
      description:
        "Tư vấn mua bán căn hộ, nhà phố khu Đông TP.HCM. Pháp lý minh bạch, hỗ trợ vay ngân hàng đến 70%, bàn giao đúng tiến độ."
    },
    sections: [
      {
        type: "nav_bar",
        props: {
          logoText: "Landmark Realty",
          links: [
            { label: "Dự án", href: "#projects" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Liên hệ", href: "#booking" }
          ],
          ctaLabel: "Tư vấn miễn phí",
          ctaHref: "#booking",
          variant: "sticky_cta"
        },
        note: {
          purpose: "action",
          reason: "CTA tư vấn luôn trong tầm mắt khi cuộn trang."
        }
      },
      {
        type: "hero",
        props: {
          headline: "Sở hữu căn hộ khu Đông TP.HCM, pháp lý minh bạch",
          subheadline:
            "Tư vấn mua bán căn hộ, nhà phố cùng đội ngũ am hiểu thị trường khu Đông — hỗ trợ vay ngân hàng đến 70% giá trị căn hộ.",
          ctaLabel: "Đặt lịch tư vấn",
          ctaHref: "#booking",
          secondaryCtaLabel: "Xem dự án",
          secondaryCtaHref: "#projects",
          image: placeholderImage(
            "Phối cảnh dự án căn hộ khu Đông TP.HCM",
            "A85C32"
          ),
          variant: "leadgen"
        },
        note: {
          purpose: "desire",
          reason:
            "Above-the-fold: phối cảnh dự án + lời hứa 'pháp lý minh bạch' xoá lo ngại lớn nhất khi mua bất động sản."
        }
      },
      {
        type: "trust_badges",
        props: {
          items: [
            { label: "10+ năm hoạt động trong lĩnh vực bất động sản" },
            { label: "500+ giao dịch thành công" },
            { label: "Liên kết ngân hàng hỗ trợ vay đến 70%" }
          ],
          variant: "certification"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Số liệu kinh nghiệm xoá lo ngại 'liệu đơn vị tư vấn có uy tín không'."
        }
      },
      {
        type: "feature_grid",
        props: {
          heading: "Vì sao chọn Landmark Realty",
          items: [
            {
              title: "Pháp lý minh bạch",
              description:
                "Mọi dự án giới thiệu đều được kiểm tra pháp lý đầy đủ trước khi tư vấn cho khách."
            },
            {
              title: "Hỗ trợ vay ngân hàng",
              description:
                "Liên kết trực tiếp ngân hàng, hỗ trợ hồ sơ vay đến 70% giá trị căn hộ."
            },
            {
              title: "Bàn giao đúng tiến độ",
              description:
                "Chỉ giới thiệu dự án từ chủ đầu tư có lịch sử bàn giao đúng cam kết."
            },
            {
              title: "Đội ngũ tư vấn tận tâm",
              description:
                "Đồng hành từ lúc chọn căn đến sau khi nhận nhà, không chỉ chốt xong là thôi."
            }
          ],
          variant: "icon_grid"
        },
        note: {
          purpose: "understanding",
          reason:
            "Nêu rõ 4 lý do cụ thể thay vì mô tả chung chung 'uy tín, chuyên nghiệp'."
        }
      },
      {
        type: "gallery",
        props: {
          heading: "Hình ảnh dự án thực tế",
          images: [
            placeholderImage("Sảnh đón căn hộ mẫu", "DCE1E3"),
            placeholderImage("Phòng khách căn hộ 2 phòng ngủ", "C7D0D3"),
            placeholderImage("Tiện ích hồ bơi nội khu", "B3BFC3"),
            placeholderImage("View ban công căn hộ khu Đông", "DCE1E3")
          ],
          variant: "grid"
        },
        note: {
          purpose: "desire",
          reason: "Hình ảnh thực tế giúp khách hình dung không gian sống thật."
        }
      },
      {
        type: "map_location",
        props: {
          heading: "Văn phòng giao dịch Landmark Realty",
          address: "88 Đường Nguyễn Thị Định, TP. Thủ Đức, TP.HCM",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.395!2d106.7717!3d10.7959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
          hours: [
            "Thứ 2 - Thứ 7: 8:00 - 18:00",
            "Chủ nhật: 8:00 - 12:00 (chỉ tư vấn qua điện thoại)"
          ],
          phone: "0909123456",
          email: "tuvan@landmarkrealty.vn",
          variant: "side_by_side"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Địa chỉ văn phòng thật + giờ làm việc rõ ràng tăng độ tin cậy trước khi khách đặt lịch."
        }
      },
      {
        type: "testimonial",
        props: {
          heading: "Khách hàng nói gì",
          items: [
            {
              quote:
                "Đội ngũ hỗ trợ hồ sơ vay ngân hàng rất kỹ, mình được duyệt vay 65% mà không tốn nhiều thời gian đi lại.",
              authorName: "Nguyễn Việt Hưng",
              authorTitle: "Chủ căn hộ 2 phòng ngủ",
              evidenceRef: "testimonial-realestate-1"
            },
            {
              quote:
                "Được tư vấn kỹ về pháp lý dự án trước khi đặt cọc, không bị hối thúc như một số nơi mình từng tìm hiểu.",
              authorName: "Đặng Thuỳ Linh",
              authorTitle: "Nhà đầu tư cá nhân",
              evidenceRef: "testimonial-realestate-2"
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
          heading: "Các loại hình căn hộ hiện có",
          plans: [
            {
              name: "Căn hộ Studio",
              price: "1.85 tỷ",
              period: "khởi điểm",
              features: [
                "Diện tích 35-40m²",
                "Phù hợp người độc thân/cặp đôi",
                "Hỗ trợ vay đến 70%"
              ],
              ctaLabel: "Xem chi tiết",
              ctaHref: "#booking",
              highlighted: false
            },
            {
              name: "Căn hộ 2 phòng ngủ",
              price: "2.95 tỷ",
              period: "khởi điểm",
              features: [
                "Diện tích 65-70m²",
                "Phù hợp gia đình nhỏ",
                "Hỗ trợ vay đến 70%",
                "Tặng gói nội thất cơ bản"
              ],
              ctaLabel: "Đặt lịch xem căn mẫu",
              ctaHref: "#booking",
              highlighted: true
            },
            {
              name: "Nhà phố liền kề",
              price: "6.5 tỷ",
              period: "khởi điểm",
              features: [
                "Diện tích đất 80-100m²",
                "Sổ hồng riêng từng căn",
                "Hỗ trợ vay đến 50%"
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
          reason:
            "3 loại hình giá rõ ràng, căn hộ 2 phòng ngủ được đề xuất (highlighted) vì nhu cầu phổ biến nhất."
        }
      },
      {
        type: "faq_accordion",
        props: {
          heading: "Câu hỏi thường gặp",
          items: [
            {
              question: "Dự án đã có sổ hồng chưa?",
              answer:
                "Từng dự án có tình trạng pháp lý khác nhau — đội ngũ tư vấn sẽ cung cấp đầy đủ hồ sơ pháp lý cụ thể khi khách quan tâm một dự án nhất định."
            },
            {
              question: "Vay ngân hàng cần chuẩn bị giấy tờ gì?",
              answer:
                "CMND/CCCD, sổ hộ khẩu, chứng minh thu nhập — đội ngũ sẽ hỗ trợ chuẩn bị hồ sơ và làm việc trực tiếp với ngân hàng liên kết."
            },
            {
              question: "Có được xem căn hộ mẫu trước khi đặt cọc không?",
              answer:
                "Có — khách hàng luôn được sắp xếp xem căn hộ mẫu hoặc thực tế công trình trước khi quyết định đặt cọc."
            },
            {
              question: "Thời gian bàn giao dự kiến là bao lâu?",
              answer:
                "Tuỳ dự án, thường 18-24 tháng kể từ ngày mở bán — thời gian cụ thể được cung cấp trong hợp đồng mua bán."
            }
          ],
          variant: "single_column"
        },
        note: {
          purpose: "risk_reduction",
          reason:
            "Trả lời trước 4 băn khoăn phổ biến nhất khi mua bất động sản."
        }
      },
      {
        type: "lead_form",
        props: {
          heading: "Đặt lịch tư vấn miễn phí",
          submitLabel: "Xác nhận đặt lịch",
          showEmail: true,
          showPersona: true,
          personaOptions: [
            "Mua để ở",
            "Đầu tư cho thuê",
            "Đầu tư lướt sóng",
            "Chưa xác định"
          ],
          consentText: "Tôi đồng ý được liên hệ tư vấn về dự án",
          variant: "inline_progressive"
        },
        note: {
          purpose: "action",
          reason: "Form đặt lịch tư vấn — điểm chuyển đổi chính của toàn trang."
        }
      },
      {
        type: "footer",
        props: {
          logoText: "Landmark Realty",
          links: [
            { label: "Dự án", href: "#projects" },
            { label: "Bảng giá", href: "#pricing" },
            { label: "Liên hệ", href: "#booking" }
          ],
          copyrightText: "© 2026 Landmark Realty",
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
