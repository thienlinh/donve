import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { announcementBarPropsSchema } from "./components/announcement-bar.js";
import { blogArticleGridPropsSchema } from "./components/blog-article-grid.js";
import { comparisonTablePropsSchema } from "./components/comparison-table.js";
import { countdownTimerPropsSchema } from "./components/countdown-timer.js";
import { ctaAppDownloadPropsSchema } from "./components/cta-app-download.js";
import { ctaBannerPropsSchema } from "./components/cta-banner.js";
import { ctaEmailCapturePropsSchema } from "./components/cta-email-capture.js";
import { ctaInlinePropsSchema } from "./components/cta-inline.js";
import { ctaStickyPropsSchema } from "./components/cta-sticky.js";
import { dividerPropsSchema } from "./components/divider.js";
import { faqAccordionPropsSchema } from "./components/faq-accordion.js";
import { featureAlternatingPropsSchema } from "./components/feature-alternating.js";
import { featureBentoPropsSchema } from "./components/feature-bento.js";
import { featureChecklistPropsSchema } from "./components/feature-checklist.js";
import { featureGridPropsSchema } from "./components/feature-grid.js";
import { featureIconListPropsSchema } from "./components/feature-icon-list.js";
import { featureLinkColumnsPropsSchema } from "./components/feature-link-columns.js";
import { featureTabsPropsSchema } from "./components/feature-tabs.js";
import { featureWithScreenshotPropsSchema } from "./components/feature-with-screenshot.js";
import { footerColumnsNewsletterPropsSchema } from "./components/footer-columns-newsletter.js";
import { footerColumnsWithSubscribePropsSchema } from "./components/footer-columns-with-subscribe.js";
import { footerMinimalSocialPropsSchema } from "./components/footer-minimal-social.js";
import { footerMultiColumnSocialPropsSchema } from "./components/footer-multi-column-social.js";
import { footerPropsSchema } from "./components/footer.js";
import { galleryPropsSchema } from "./components/gallery.js";
import { heroCenteredSignupPropsSchema } from "./components/hero-centered-signup.js";
import { heroCenteredPropsSchema } from "./components/hero-centered.js";
import { heroSplitImagePropsSchema } from "./components/hero-split-image.js";
import { heroSplitSignupPropsSchema } from "./components/hero-split-signup.js";
import { heroVideoPropsSchema } from "./components/hero-video.js";
import { heroPropsSchema } from "./components/hero.js";
import { howItWorksPropsSchema } from "./components/how-it-works.js";
import { leadFormPropsSchema } from "./components/lead-form.js";
import { logoWallPropsSchema } from "./components/logo-wall.js";
import { mapLocationPropsSchema } from "./components/map-location.js";
import { mediaPropsSchema } from "./components/media.js";
import { metricProofPropsSchema } from "./components/metric-proof.js";
import { navBarPropsSchema } from "./components/nav-bar.js";
import { navCenteredLinksPropsSchema } from "./components/nav-centered-links.js";
import { navCenteredLogoPropsSchema } from "./components/nav-centered-logo.js";
import { navDividedLinksPropsSchema } from "./components/nav-divided-links.js";
import { navWithIconButtonPropsSchema } from "./components/nav-with-icon-button.js";
import { pageRootPropsSchema } from "./components/page-root.js";
import { pricingComparisonTablePropsSchema } from "./components/pricing-comparison-table.js";
import { pricingTablePropsSchema } from "./components/pricing-table.js";
import { pricingToggleBillingPropsSchema } from "./components/pricing-toggle-billing.js";
import { problemStatementPropsSchema } from "./components/problem-statement.js";
import { rawHtmlBlockPropsSchema } from "./components/raw-html-block.js";
import { richTextBlockPropsSchema } from "./components/rich-text-block.js";
import { solutionOverviewPropsSchema } from "./components/solution-overview.js";
import { spacerPropsSchema } from "./components/spacer.js";
import { stepNumberedIconTimelinePropsSchema } from "./components/step-numbered-icon-timeline.js";
import { stepTabNavigatorPropsSchema } from "./components/step-tab-navigator.js";
import { stepTimelineWithImagePropsSchema } from "./components/step-timeline-with-image.js";
import { teamBorderedCardsPropsSchema } from "./components/team-bordered-cards.js";
import { teamGridSocialPropsSchema } from "./components/team-grid-social.js";
import { teamGridPropsSchema } from "./components/team-grid.js";
import { teamProfileSocialPropsSchema } from "./components/team-profile-social.js";
import { testimonialSingleLargePropsSchema } from "./components/testimonial-single-large.js";
import { testimonialThreeColumnAvatarPropsSchema } from "./components/testimonial-three-column-avatar.js";
import { testimonialTwoColumnCardsPropsSchema } from "./components/testimonial-two-column-cards.js";
import { testimonialPropsSchema } from "./components/testimonial.js";
import { trustBadgesPropsSchema } from "./components/trust-badges.js";
import { exampleProps } from "./example-props.js";

export const catalog = defineCatalog(schema, {
  components: {
    page_root: {
      props: pageRootPropsSchema,
      slots: [],
      description:
        "Root container — holds the page's ordered top-level sections."
    },
    hero: {
      props: heroPropsSchema,
      slots: [],
      description: "Above-the-fold: headline, subheadline, CTA chính+phụ.",
      example: exampleProps.hero
    },
    hero_centered: {
      props: heroCenteredPropsSchema,
      slots: [],
      description: "Hero căn giữa: ảnh lớn phía trên, headline + CTA bên dưới.",
      example: exampleProps.hero_centered
    },
    hero_split_image: {
      props: heroSplitImagePropsSchema,
      slots: [],
      description: "Hero 2 cột: nội dung + CTA một bên, ảnh minh hoạ một bên.",
      example: exampleProps.hero_split_image
    },
    hero_centered_signup: {
      props: heroCenteredSignupPropsSchema,
      slots: [],
      description:
        "Hero căn giữa kèm form đăng ký nhanh (1 field) ngay dưới headline.",
      example: exampleProps.hero_centered_signup
    },
    hero_split_signup: {
      props: heroSplitSignupPropsSchema,
      slots: [],
      description:
        "Hero 2 cột kèm form đăng ký nhanh (1 field) cạnh headline, ảnh minh hoạ bên còn lại.",
      example: exampleProps.hero_split_signup
    },
    hero_video: {
      props: heroVideoPropsSchema,
      slots: [],
      description:
        "Hero 2 cột: nội dung + CTA một bên, video (upload/YouTube/Vimeo) một bên.",
      example: exampleProps.hero_video
    },
    nav_bar: {
      props: navBarPropsSchema,
      slots: [],
      description: "Site navigation bar with logo, links, optional CTA.",
      example: exampleProps.nav_bar
    },
    nav_centered_links: {
      props: navCenteredLinksPropsSchema,
      slots: [],
      description: "Nav với logo trái, link+CTA căn giữa/phải cùng hàng.",
      example: exampleProps.nav_centered_links
    },
    nav_centered_logo: {
      props: navCenteredLogoPropsSchema,
      slots: [],
      description: "Nav với logo căn giữa, link chia đều 2 bên.",
      example: exampleProps.nav_centered_logo
    },
    nav_divided_links: {
      props: navDividedLinksPropsSchema,
      slots: [],
      description: "Nav với logo trái, link ngăn cách bằng đường kẻ dọc.",
      example: exampleProps.nav_divided_links
    },
    nav_with_icon_button: {
      props: navWithIconButtonPropsSchema,
      slots: [],
      description: "Nav với logo trái, link giữa, nút CTA icon bên phải.",
      example: exampleProps.nav_with_icon_button
    },
    logo_wall: {
      props: logoWallPropsSchema,
      slots: [],
      description: "Trust signal: grid or marquee of partner/customer logos.",
      example: exampleProps.logo_wall
    },
    testimonial: {
      props: testimonialPropsSchema,
      slots: [],
      description: "Customer quote(s), each backed by an evidenceRef.",
      example: exampleProps.testimonial
    },
    testimonial_single_large: {
      props: testimonialSingleLargePropsSchema,
      slots: [],
      description: "Một trích dẫn lớn, căn giữa — icon trích dẫn phía trên.",
      example: exampleProps.testimonial_single_large
    },
    testimonial_three_column_avatar: {
      props: testimonialThreeColumnAvatarPropsSchema,
      slots: [],
      description: "3 trích dẫn cùng hàng, mỗi cái kèm avatar người nói.",
      example: exampleProps.testimonial_three_column_avatar
    },
    testimonial_two_column_cards: {
      props: testimonialTwoColumnCardsPropsSchema,
      slots: [],
      description: "2 trích dẫn dạng thẻ cạnh nhau, avatar tuỳ chọn.",
      example: exampleProps.testimonial_two_column_cards
    },
    metric_proof: {
      props: metricProofPropsSchema,
      slots: [],
      description: "Row/cards of proof metrics (counters, stats).",
      example: exampleProps.metric_proof
    },
    problem_statement: {
      props: problemStatementPropsSchema,
      slots: [],
      description:
        "Frames the visitor's problem before presenting the solution.",
      example: exampleProps.problem_statement
    },
    solution_overview: {
      props: solutionOverviewPropsSchema,
      slots: [],
      description: "How the product solves the stated problem.",
      example: exampleProps.solution_overview
    },
    feature_bento: {
      props: featureBentoPropsSchema,
      slots: [],
      description: "Bento-grid feature/benefit cards.",
      example: exampleProps.feature_bento
    },
    feature_grid: {
      props: featureGridPropsSchema,
      slots: [],
      description: "Icon or screenshot grid of features.",
      example: exampleProps.feature_grid
    },
    feature_tabs: {
      props: featureTabsPropsSchema,
      slots: [],
      description: "Tabbed feature deep-dive.",
      example: exampleProps.feature_tabs
    },
    feature_alternating: {
      props: featureAlternatingPropsSchema,
      slots: [],
      description: "Danh sách tính năng dạng zig-zag, icon xen kẽ trái/phải.",
      example: exampleProps.feature_alternating
    },
    feature_checklist: {
      props: featureChecklistPropsSchema,
      slots: [],
      description: "Lưới checklist tính năng dạng dấu tick, 2-3 cột.",
      example: exampleProps.feature_checklist
    },
    feature_icon_list: {
      props: featureIconListPropsSchema,
      slots: [],
      description:
        "Danh sách tính năng có icon + mô tả, kèm link tìm hiểu thêm.",
      example: exampleProps.feature_icon_list
    },
    feature_link_columns: {
      props: featureLinkColumnsPropsSchema,
      slots: [],
      description: "Tính năng nhóm theo cột, mỗi cột là danh sách link.",
      example: exampleProps.feature_link_columns
    },
    feature_with_screenshot: {
      props: featureWithScreenshotPropsSchema,
      slots: [],
      description:
        "Ảnh chụp màn hình sản phẩm kèm danh sách tính năng bên cạnh.",
      example: exampleProps.feature_with_screenshot
    },
    how_it_works: {
      props: howItWorksPropsSchema,
      slots: [],
      description: "Numbered steps or timeline explaining the process.",
      example: exampleProps.how_it_works
    },
    step_numbered_icon_timeline: {
      props: stepNumberedIconTimelinePropsSchema,
      slots: [],
      description: "Timeline dọc, mỗi bước đánh số kèm icon tròn.",
      example: exampleProps.step_numbered_icon_timeline
    },
    step_tab_navigator: {
      props: stepTabNavigatorPropsSchema,
      slots: [],
      description: "Tab chọn bước, ảnh minh hoạ + mô tả đổi theo tab active.",
      example: exampleProps.step_tab_navigator
    },
    step_timeline_with_image: {
      props: stepTimelineWithImagePropsSchema,
      slots: [],
      description: "Timeline dọc các bước kèm ảnh minh hoạ lớn bên cạnh.",
      example: exampleProps.step_timeline_with_image
    },
    pricing_table: {
      props: pricingTablePropsSchema,
      slots: [],
      description: "Pricing plans with feature lists and CTA per plan.",
      example: exampleProps.pricing_table
    },
    pricing_comparison_table: {
      props: pricingComparisonTablePropsSchema,
      slots: [],
      description:
        "Bảng giá dạng so sánh: tốc độ, dung lượng, giá theo từng gói.",
      example: exampleProps.pricing_comparison_table
    },
    pricing_toggle_billing: {
      props: pricingToggleBillingPropsSchema,
      slots: [],
      description: "Bảng giá dạng thẻ, toggle chu kỳ thanh toán tháng/năm.",
      example: exampleProps.pricing_toggle_billing
    },
    comparison_table: {
      props: comparisonTablePropsSchema,
      slots: [],
      description: "Us-vs-them feature comparison table.",
      example: exampleProps.comparison_table
    },
    faq_accordion: {
      props: faqAccordionPropsSchema,
      slots: [],
      description: "Objection-handling FAQ accordion.",
      example: exampleProps.faq_accordion
    },
    trust_badges: {
      props: trustBadgesPropsSchema,
      slots: [],
      description: "Security/certification/guarantee badges.",
      example: exampleProps.trust_badges
    },
    lead_form: {
      props: leadFormPropsSchema,
      slots: [],
      description:
        "Lead capture form — wire-compatible with landing-runtime's lead-form hook.",
      example: exampleProps.lead_form
    },
    cta_banner: {
      props: ctaBannerPropsSchema,
      slots: [],
      description: "Standalone call-to-action banner section.",
      example: exampleProps.cta_banner
    },
    cta_inline: {
      props: ctaInlinePropsSchema,
      slots: [],
      description: "CTA 1 dòng: headline + nút, không có hình ảnh.",
      example: exampleProps.cta_inline
    },
    cta_email_capture: {
      props: ctaEmailCapturePropsSchema,
      slots: [],
      description: "CTA kèm form thu email (tên+email), dạng thẻ hoặc inline.",
      example: exampleProps.cta_email_capture
    },
    cta_app_download: {
      props: ctaAppDownloadPropsSchema,
      slots: [],
      description: "CTA tải app: headline + 2 nút Google Play/App Store.",
      example: exampleProps.cta_app_download
    },
    cta_sticky: {
      props: ctaStickyPropsSchema,
      slots: [],
      description: "Sticky bottom bar or floating CTA button.",
      example: exampleProps.cta_sticky
    },
    rich_text_block: {
      props: richTextBlockPropsSchema,
      slots: [],
      description: "Structured long-form content (never raw HTML).",
      example: exampleProps.rich_text_block
    },
    gallery: {
      props: galleryPropsSchema,
      slots: [],
      description: "Image grid or carousel.",
      example: exampleProps.gallery
    },
    media: {
      props: mediaPropsSchema,
      slots: [],
      description:
        "Single image or video (upload / YouTube / Vimeo) — not a multi-image grid.",
      example: exampleProps.media
    },
    blog_article_grid: {
      props: blogArticleGridPropsSchema,
      slots: [],
      description: "Grid or list of blog/resource article cards.",
      example: exampleProps.blog_article_grid
    },
    map_location: {
      props: mapLocationPropsSchema,
      slots: [],
      description:
        "Address, hours/contact and embedded map — for local businesses.",
      example: exampleProps.map_location
    },
    countdown_timer: {
      props: countdownTimerPropsSchema,
      slots: [],
      description: "Urgency: counts down to a deadline (sale, webinar).",
      example: exampleProps.countdown_timer
    },
    team_grid: {
      props: teamGridPropsSchema,
      slots: [],
      description: "Team member photo grid or single-founder spotlight.",
      example: exampleProps.team_grid
    },
    team_bordered_cards: {
      props: teamBorderedCardsPropsSchema,
      slots: [],
      description: "Lưới thành viên dạng thẻ viền, ảnh nhỏ + tên/chức danh.",
      example: exampleProps.team_bordered_cards
    },
    team_grid_social: {
      props: teamGridSocialPropsSchema,
      slots: [],
      description: "Lưới thành viên với ảnh lớn, tiểu sử và link mạng xã hội.",
      example: exampleProps.team_grid_social
    },
    team_profile_social: {
      props: teamProfileSocialPropsSchema,
      slots: [],
      description:
        "Hồ sơ thành viên 2 cột, ảnh + tiểu sử chi tiết và link mạng xã hội.",
      example: exampleProps.team_profile_social
    },
    footer: {
      props: footerPropsSchema,
      slots: [],
      description: "Site footer with links and optional newsletter signup.",
      example: exampleProps.footer
    },
    footer_minimal_social: {
      props: footerMinimalSocialPropsSchema,
      slots: [],
      description: "Footer tối giản 1 dòng: logo, bản quyền, link mạng xã hội.",
      example: exampleProps.footer_minimal_social
    },
    footer_multi_column_social: {
      props: footerMultiColumnSocialPropsSchema,
      slots: [],
      description: "Footer nhiều cột link kèm logo, mô tả và link mạng xã hội.",
      example: exampleProps.footer_multi_column_social
    },
    footer_columns_with_subscribe: {
      props: footerColumnsWithSubscribePropsSchema,
      slots: [],
      description:
        "Footer nhiều cột link kèm ô đăng ký nhận tin trong cùng lưới.",
      example: exampleProps.footer_columns_with_subscribe
    },
    footer_columns_newsletter: {
      props: footerColumnsNewsletterPropsSchema,
      slots: [],
      description:
        "Footer nhiều cột link, form đăng ký nhận tin ở dải riêng bên dưới.",
      example: exampleProps.footer_columns_newsletter
    },
    divider: {
      props: dividerPropsSchema,
      slots: [],
      description: "Visual divider between sections.",
      example: exampleProps.divider
    },
    spacer: {
      props: spacerPropsSchema,
      slots: [],
      description: "Vertical whitespace between sections.",
      example: exampleProps.spacer
    },
    announcement_bar: {
      props: announcementBarPropsSchema,
      slots: [],
      description: "Top-of-page announcement/promo strip.",
      example: exampleProps.announcement_bar
    },
    // Pseudo-component escape hatch — no `example`, same reasoning as `page_root`: not one of
    // the ~25 taxonomy components offered for AI/manual insertion. Holds verbatim markup when
    // nothing in the real catalog fits (e.g. an unmatched section, or AI-authored raw HTML).
    raw_html_block: {
      props: rawHtmlBlockPropsSchema,
      slots: [],
      description:
        "Original markup preserved verbatim, no typed content fields."
    }
  },
  // No json-render `actions` (state-mutating, editor-only) — publish-time interactivity is
  // landing-runtime's job via static `data-dv-*` hooks, not the json-render action system.
  actions: {}
});

export type StudioCatalog = typeof catalog;

/**
 * Per-component props schema + description, keyed by componentId. `catalog.data` isn't part of
 * `Catalog<...>`'s public TS surface (same reason `features/studio-native`'s Inspector casts it
 * on the app side) — the shape is real at runtime, just not typed that way. Cast once
 * here so every consumer (spec-ops validation, AI prompt JSON Schemas, Content Agent) shares it.
 */
export const catalogComponents = catalog.data.components as Record<
  string,
  {
    props: {
      toJSONSchema(): unknown;
      safeParse(value: unknown): {
        success: boolean;
        data?: unknown;
        error?: Error;
      };
    };
    description: string;
  }
>;
