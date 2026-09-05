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
  hero_centered: {
    headline: "Ra mắt landing page trong 5 phút",
    subheadline: "AI và thao tác thủ công cùng lên 1 hệ thống",
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup",
    image
  },
  hero_split_image: {
    headline: "Ra mắt landing page trong 5 phút",
    subheadline: "AI và thao tác thủ công cùng lên 1 hệ thống",
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup",
    image,
    variant: "image_right"
  },
  hero_centered_signup: {
    headline: "Nhận bản demo miễn phí",
    subheadline: "Để lại email, đội ngũ sẽ liên hệ trong 24h",
    inputLabel: "Email",
    inputPlaceholder: "ban@congty.com",
    ctaLabel: "Đăng ký",
    ctaHref: "/signup",
    image
  },
  hero_split_signup: {
    headline: "Nhận bản demo miễn phí",
    subheadline: "Để lại email, đội ngũ sẽ liên hệ trong 24h",
    inputLabel: "Email",
    inputPlaceholder: "ban@congty.com",
    ctaLabel: "Đăng ký",
    ctaHref: "/signup",
    image,
    variant: "image_right"
  },
  hero_video: {
    headline: "Xem sản phẩm hoạt động trong 60 giây",
    subheadline: "Demo nhanh các tính năng chính trước khi đăng ký",
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup",
    embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    variant: "youtube"
  },
  nav_bar: {
    logoText: "DonVe",
    links: [{ label: "Giá", href: "#pricing" }],
    variant: "simple"
  },
  nav_centered_links: {
    logoText: "DonVe",
    links: [{ label: "Giá", href: "#pricing" }],
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup"
  },
  nav_centered_logo: {
    logoText: "DonVe",
    links: [{ label: "Giá", href: "#pricing" }],
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup"
  },
  nav_divided_links: {
    logoText: "DonVe",
    links: [{ label: "Giá", href: "#pricing" }],
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup"
  },
  nav_with_icon_button: {
    logoText: "DonVe",
    links: [{ label: "Giá", href: "#pricing" }],
    ctaLabel: "Bắt đầu",
    ctaHref: "/signup"
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
  testimonial_single_large: {
    quote: "DonVe giúp team growth ra landing page nhanh gấp 10 lần.",
    authorName: "Nguyễn A",
    authorTitle: "CEO, Acme",
    evidenceRef: "testimonial-1",
    variant: "single_large"
  },
  testimonial_three_column_avatar: {
    items: [
      {
        quote: "Rất dễ dùng",
        authorName: "Nguyễn A",
        authorTitle: "CEO",
        authorAvatar: image,
        evidenceRef: "testimonial-1"
      }
    ],
    variant: "three_column_avatar"
  },
  testimonial_two_column_cards: {
    heading: "Khách hàng nói gì",
    items: [
      {
        quote: "Rất dễ dùng",
        authorName: "Nguyễn A",
        authorTitle: "CEO",
        authorAvatar: image,
        evidenceRef: "testimonial-1"
      }
    ],
    variant: "two_column_cards"
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
  feature_alternating: {
    items: [
      { title: "Nhanh", description: "Xong trong 5 phút", iconName: "⚡" },
      { title: "Đo lường được", description: "Tracking deterministic" }
    ],
    ctaLabel: "Khám phá ngay",
    ctaHref: "/signup",
    variant: "with_divider"
  },
  feature_checklist: {
    heading: "Mọi thứ bạn cần",
    subheading: "Không cần công cụ nào khác",
    items: [
      { label: "AI dựng trang" },
      { label: "Component đã kiểm chứng" },
      { label: "Xuất HTML sạch" },
      { label: "Đo lường được" }
    ],
    ctaLabel: "Khám phá ngay",
    ctaHref: "/signup",
    variant: "two_column"
  },
  feature_icon_list: {
    heading: "Tính năng nổi bật",
    subheading: "Đủ dùng cho mọi đội growth",
    items: [
      { title: "Nhanh", description: "Xong trong 5 phút", iconName: "⚡" },
      { title: "Đo lường được", description: "Tracking deterministic" }
    ],
    ctaLabel: "Khám phá ngay",
    ctaHref: "/signup",
    variant: "left_aligned"
  },
  feature_link_columns: {
    heading: "Tài nguyên",
    subheading: "Mọi thứ ở một nơi",
    groups: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Landing page", href: "/product" },
          { label: "Bảng giá", href: "/pricing" }
        ]
      },
      {
        title: "Công ty",
        links: [
          { label: "Giới thiệu", href: "/about" },
          { label: "Liên hệ", href: "/contact" }
        ]
      }
    ],
    ctaLabel: "Khám phá ngay",
    ctaHref: "/signup",
    variant: "icon_bullets"
  },
  feature_with_screenshot: {
    screenshot: image,
    items: [
      { title: "Nhanh", description: "Xong trong 5 phút", iconName: "⚡" },
      { title: "Đo lường được", description: "Tracking deterministic" }
    ],
    variant: "image_left"
  },
  how_it_works: {
    steps: [
      { title: "Mô tả business", description: "..." },
      { title: "AI dựng trang", description: "..." }
    ],
    variant: "numbered_steps"
  },
  step_numbered_icon_timeline: {
    steps: [
      { title: "Mô tả business", description: "...", iconName: "1" },
      { title: "AI dựng trang", description: "...", iconName: "2" }
    ]
  },
  step_tab_navigator: {
    tabs: [{ label: "Tổng quan" }, { label: "Chi tiết" }],
    activeIndex: 0,
    image,
    heading: "Cách hoạt động",
    description: "Chọn tab để xem chi tiết từng bước"
  },
  step_timeline_with_image: {
    heading: "Cách hoạt động",
    steps: [
      { label: "Mô tả business", description: "..." },
      { label: "AI dựng trang", description: "..." }
    ],
    image
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
  pricing_comparison_table: {
    heading: "So sánh các gói",
    rows: [
      { name: "Cơ bản", speed: "Chuẩn", storage: "10GB", price: "0đ" },
      { name: "Pro", speed: "Nhanh", storage: "100GB", price: "299k" }
    ],
    learnMoreLabel: "Xem chi tiết",
    learnMoreHref: "/pricing",
    ctaLabel: "Chọn gói",
    ctaHref: "/signup"
  },
  pricing_toggle_billing: {
    heading: "Bảng giá",
    plans: [
      {
        name: "Cơ bản",
        price: "0đ",
        period: "tháng",
        features: ["1 trang"],
        ctaLabel: "Chọn",
        ctaHref: "/signup",
        highlighted: false
      }
    ]
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
  cta_inline: {
    headline: "Sẵn sàng tăng conversion?",
    ctaLabel: "Dùng thử",
    ctaHref: "/signup"
  },
  cta_email_capture: {
    headline: "Nhận bản demo miễn phí",
    description: "Để lại thông tin, đội ngũ sẽ liên hệ trong 24h",
    nameLabel: "Họ tên",
    emailLabel: "Email",
    ctaLabel: "Đăng ký",
    ctaHref: "/signup",
    helperText: "Chúng tôi không spam",
    variant: "card"
  },
  cta_app_download: {
    eyebrow: "Tải ứng dụng",
    headline: "Trải nghiệm DonVe trên di động",
    googlePlay: { label: "TẢI VỀ TRÊN", sublabel: "Google Play", href: "#" },
    appStore: { label: "TẢI VỀ TRÊN", sublabel: "App Store", href: "#" }
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
  blog_article_grid: {
    heading: "Bài viết mới nhất",
    articles: [
      {
        title: "5 mẹo tối ưu landing page",
        excerpt: "Những thay đổi nhỏ giúp tăng tỉ lệ chuyển đổi.",
        image,
        href: "/blog/toi-uu-landing-page",
        tag: "Mẹo",
        date: "12/08/2026"
      },
      {
        title: "So sánh AI content agent và tự viết tay",
        excerpt: "Khi nào nên để AI viết, khi nào cần con người.",
        image,
        href: "/blog/ai-vs-tu-viet",
        tag: "Sản phẩm",
        date: "01/08/2026"
      }
    ],
    variant: "grid_3col"
  },
  map_location: {
    heading: "Ghé thăm chúng tôi",
    address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=example",
    hours: ["Thứ 2 - Thứ 6: 8:00 - 18:00", "Thứ 7: 8:00 - 12:00"],
    phone: "0901234567",
    email: "hi@donve.com",
    variant: "side_by_side"
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
  team_bordered_cards: {
    heading: "Đội ngũ",
    members: [{ name: "Trần B", role: "Founder", photo: image }]
  },
  team_grid_social: {
    heading: "Đội ngũ",
    members: [
      {
        name: "Trần B",
        role: "Founder",
        bio: "10 năm kinh nghiệm growth.",
        photo: image,
        socialLinks: [{ label: "LinkedIn", href: "#" }]
      }
    ]
  },
  team_profile_social: {
    heading: "Đội ngũ",
    members: [
      {
        name: "Trần B",
        role: "Founder",
        bio: "10 năm kinh nghiệm growth.",
        photo: image,
        socialLinks: [{ label: "LinkedIn", href: "#" }]
      }
    ]
  },
  footer: {
    logoText: "DonVe",
    copyrightText: "© 2026 DonVe",
    variant: "minimal"
  },
  footer_minimal_social: {
    logoText: "DonVe",
    copyrightText: "© 2026 DonVe",
    socialLinks: [{ label: "LinkedIn", href: "#" }]
  },
  footer_multi_column_social: {
    logoText: "DonVe",
    description: "Landing page dựng bằng AI trong 5 phút.",
    groups: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Landing page", href: "/product" },
          { label: "Bảng giá", href: "/pricing" }
        ]
      },
      {
        title: "Công ty",
        links: [
          { label: "Giới thiệu", href: "/about" },
          { label: "Liên hệ", href: "/contact" }
        ]
      }
    ],
    copyrightText: "© 2026 DonVe",
    socialLinks: [{ label: "LinkedIn", href: "#" }],
    variant: "logo_left"
  },
  footer_columns_with_subscribe: {
    logoText: "DonVe",
    groups: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Landing page", href: "/product" },
          { label: "Bảng giá", href: "/pricing" }
        ]
      }
    ],
    subscribeHeading: "Nhận tin mới",
    subscribePlaceholder: "ban@congty.com",
    subscribeButtonLabel: "Đăng ký",
    subscribeNote: "Chúng tôi không spam",
    copyrightText: "© 2026 DonVe",
    socialLinks: [{ label: "LinkedIn", href: "#" }]
  },
  footer_columns_newsletter: {
    groups: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Landing page", href: "/product" },
          { label: "Bảng giá", href: "/pricing" }
        ]
      }
    ],
    newsletterLabel: "Nhận tin mới",
    newsletterPlaceholder: "ban@congty.com",
    newsletterButtonLabel: "Đăng ký",
    newsletterNote: "Chúng tôi không spam",
    socialLinks: [{ label: "LinkedIn", href: "#" }],
    copyrightText: "© 2026 DonVe",
    tagline: "Xây dựng cho đội growth"
  },
  divider: {},
  spacer: { size: "md" },
  announcement_bar: {
    text: "Ưu đãi ra mắt -20%",
    dismissible: true
  }
};
