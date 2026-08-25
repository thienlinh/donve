const image = { src: "https://example.com/a.jpg", alt: "demo" };

/**
 * One valid props value per catalog component, keyed by componentId. Serves 3 purposes:
 * catalog `example` (AI prompt hints), the SSR smoke test's fixtures, and the Studio "Add
 * section" default props when a user inserts a section by hand (no AI involved).
 */
export const exampleProps: Record<string, Record<string, unknown>> = {
  hero: {
    headline: "Ra mắt landing page trong 5 phút",
    subheadline: "AI và thao tác thủ công cùng lên 1 hệ thống",
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup",
    image,
    variant: "saas"
  },
  nav_bar: {
    logoText: "DonVe",
    links: [{ label: "Giá", href: "#pricing" }],
    variant: "simple"
  },
  logo_wall: {
    logos: [image, image, image],
    variant: "grid"
  },
  testimonial: {
    items: [
      {
        quote: "Tuyệt vời",
        authorName: "Nguyễn A",
        authorTitle: "CEO",
        evidenceRef: "testimonial-1"
      }
    ],
    variant: "single_quote"
  },
  metric_proof: {
    metrics: [
      { value: "1200+", label: "khách hàng", evidenceRef: "metric-1" },
      { value: "98%", label: "hài lòng", evidenceRef: "metric-2" }
    ],
    variant: "counter_row"
  },
  problem_statement: {
    headline: "Landing page chậm, không đo lường được",
    body: "Đội growth mất hàng tuần để ra 1 trang",
    variant: "split_text_image"
  },
  solution_overview: {
    headline: "Component Library đã kiểm chứng",
    body: "AI chọn, điền, tinh chỉnh — không tự vẽ layout",
    variant: "split"
  },
  feature_bento: {
    items: [
      { title: "Nhanh", description: "Xong trong 5 phút" },
      { title: "Đo lường được", description: "Tracking deterministic" },
      { title: "Chất lượng", description: "Component đã kiểm chứng" },
      { title: "Không khoá nền tảng", description: "Export HTML sạch" }
    ],
    variant: "2x2"
  },
  feature_grid: {
    items: [
      { title: "A", description: "a" },
      { title: "B", description: "b" },
      { title: "C", description: "c" }
    ],
    variant: "icon_grid"
  },
  feature_tabs: {
    tabs: [
      { tabLabel: "Tổng quan", title: "Tổng quan", description: "..." },
      { tabLabel: "Chi tiết", title: "Chi tiết", description: "..." }
    ],
    variant: "horizontal_tabs"
  },
  how_it_works: {
    steps: [
      { title: "Mô tả business", description: "..." },
      { title: "AI dựng trang", description: "..." }
    ],
    variant: "numbered_steps"
  },
  pricing_table: {
    plans: [
      {
        name: "Cơ bản",
        price: "0đ",
        features: ["1 trang"],
        ctaLabel: "Chọn",
        ctaHref: "/signup",
        highlighted: false
      }
    ],
    variant: "single_plan"
  },
  comparison_table: {
    usLabel: "DonVe",
    themLabel: "Đối thủ",
    rows: [
      { feature: "AI generate", us: true, them: false },
      { feature: "Giá", us: "Miễn phí", them: "$99" }
    ],
    variant: "vs_competitor"
  },
  faq_accordion: {
    items: [
      { question: "Có mất phí không?", answer: "Có gói miễn phí" },
      { question: "Xuất HTML được không?", answer: "Được, luôn sạch" }
    ],
    variant: "single_column"
  },
  trust_badges: {
    items: [{ label: "Bảo mật SSL" }],
    variant: "security"
  },
  lead_form: {
    submitLabel: "Đăng ký",
    consentText: "Tôi đồng ý được liên hệ",
    variant: "inline_short"
  },
  cta_banner: {
    headline: "Sẵn sàng tăng conversion?",
    ctaLabel: "Dùng thử",
    ctaHref: "/signup",
    variant: "centered"
  },
  cta_sticky: {
    label: "Đăng ký ngay",
    ctaHref: "/signup",
    variant: "bottom_bar"
  },
  rich_text_block: {
    nodes: [{ type: "paragraph", text: "Nội dung dài." }],
    variant: "article_style"
  },
  gallery: {
    images: [image, image],
    variant: "grid"
  },
  media: {
    image,
    caption: "Ảnh sản phẩm",
    variant: "image"
  },
  countdown_timer: {
    headline: "Ưu đãi kết thúc sau",
    endsAt: "2026-12-31T23:59:59+07:00",
    expiredText: "Ưu đãi đã kết thúc",
    variant: "banner"
  },
  team_grid: {
    members: [{ name: "Trần B", role: "Founder", photo: image }],
    variant: "single_founder"
  },
  footer: {
    logoText: "DonVe",
    copyrightText: "© 2026 DonVe",
    variant: "minimal"
  },
  divider: {},
  spacer: { size: "md" },
  announcement_bar: {
    text: "Ưu đãi ra mắt -20%",
    dismissible: true
  }
};
