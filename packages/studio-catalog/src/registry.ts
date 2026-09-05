import type { BaseComponentProps } from "@json-render/react";
import { defineRegistry } from "@json-render/react";
import type { ReactNode } from "react";

import { applyElementStyle } from "./apply-element-style.js";
import { catalog } from "./catalog.js";
import { AnnouncementBarRender } from "./components/announcement-bar.js";
import { BlogArticleGridRender } from "./components/blog-article-grid.js";
import { ComparisonTableRender } from "./components/comparison-table.js";
import { CountdownTimerRender } from "./components/countdown-timer.js";
import { CtaAppDownloadRender } from "./components/cta-app-download.js";
import { CtaBannerRender } from "./components/cta-banner.js";
import { CtaEmailCaptureRender } from "./components/cta-email-capture.js";
import { CtaInlineRender } from "./components/cta-inline.js";
import { CtaStickyRender } from "./components/cta-sticky.js";
import { DividerRender } from "./components/divider.js";
import { FaqAccordionRender } from "./components/faq-accordion.js";
import { FeatureAlternatingRender } from "./components/feature-alternating.js";
import { FeatureBentoRender } from "./components/feature-bento.js";
import { FeatureChecklistRender } from "./components/feature-checklist.js";
import { FeatureGridRender } from "./components/feature-grid.js";
import { FeatureIconListRender } from "./components/feature-icon-list.js";
import { FeatureLinkColumnsRender } from "./components/feature-link-columns.js";
import { FeatureTabsRender } from "./components/feature-tabs.js";
import { FeatureWithScreenshotRender } from "./components/feature-with-screenshot.js";
import { FooterColumnsNewsletterRender } from "./components/footer-columns-newsletter.js";
import { FooterColumnsWithSubscribeRender } from "./components/footer-columns-with-subscribe.js";
import { FooterMinimalSocialRender } from "./components/footer-minimal-social.js";
import { FooterMultiColumnSocialRender } from "./components/footer-multi-column-social.js";
import { FooterRender } from "./components/footer.js";
import { GalleryRender } from "./components/gallery.js";
import { HeroCenteredSignupRender } from "./components/hero-centered-signup.js";
import { HeroCenteredRender } from "./components/hero-centered.js";
import { HeroSplitImageRender } from "./components/hero-split-image.js";
import { HeroSplitSignupRender } from "./components/hero-split-signup.js";
import { HeroVideoRender } from "./components/hero-video.js";
import { HeroRender } from "./components/hero.js";
import { HowItWorksRender } from "./components/how-it-works.js";
import { LeadFormRender } from "./components/lead-form.js";
import { LogoWallRender } from "./components/logo-wall.js";
import { MapLocationRender } from "./components/map-location.js";
import { MediaRender } from "./components/media.js";
import { MetricProofRender } from "./components/metric-proof.js";
import { NavBarRender } from "./components/nav-bar.js";
import { NavCenteredLinksRender } from "./components/nav-centered-links.js";
import { NavCenteredLogoRender } from "./components/nav-centered-logo.js";
import { NavDividedLinksRender } from "./components/nav-divided-links.js";
import { NavWithIconButtonRender } from "./components/nav-with-icon-button.js";
import { PageRootRender } from "./components/page-root.js";
import { PricingComparisonTableRender } from "./components/pricing-comparison-table.js";
import { PricingTableRender } from "./components/pricing-table.js";
import { PricingToggleBillingRender } from "./components/pricing-toggle-billing.js";
import { ProblemStatementRender } from "./components/problem-statement.js";
import { RawHtmlBlockRender } from "./components/raw-html-block.js";
import { RichTextBlockRender } from "./components/rich-text-block.js";
import { SolutionOverviewRender } from "./components/solution-overview.js";
import { SpacerRender } from "./components/spacer.js";
import { StepNumberedIconTimelineRender } from "./components/step-numbered-icon-timeline.js";
import { StepTabNavigatorRender } from "./components/step-tab-navigator.js";
import { StepTimelineWithImageRender } from "./components/step-timeline-with-image.js";
import { TeamBorderedCardsRender } from "./components/team-bordered-cards.js";
import { TeamGridSocialRender } from "./components/team-grid-social.js";
import { TeamGridRender } from "./components/team-grid.js";
import { TeamProfileSocialRender } from "./components/team-profile-social.js";
import { TestimonialSingleLargeRender } from "./components/testimonial-single-large.js";
import { TestimonialThreeColumnAvatarRender } from "./components/testimonial-three-column-avatar.js";
import { TestimonialTwoColumnCardsRender } from "./components/testimonial-two-column-cards.js";
import { TestimonialRender } from "./components/testimonial.js";
import { TrustBadgesRender } from "./components/trust-badges.js";

// oxlint-disable-next-line no-explicit-any -- wraps every catalog component's render function
// generically (same rationale as `puck-config.tsx`'s own `AnyField`); each component's actual
// props type is only known per-component, not at this shared choke point.
type AnyRender = (ctx: BaseComponentProps<any>) => ReactNode;

/** Applies a Settings-tab `style` prop at publish/SSR time, mirroring `puck-config.tsx`'s
 * `toPuckRender` for the editor canvas — the two places every catalog component's render output
 * passes through, so this is the single place style needs wiring in, not each component file. */
function withStyle(render: AnyRender): AnyRender {
  return (ctx) => applyElementStyle(render(ctx), ctx.props?.style);
}

function withStyleAll<T extends Record<string, AnyRender>>(components: T): T {
  return Object.fromEntries(
    Object.entries(components).map(([id, render]) => [id, withStyle(render)])
  ) as T;
}

export const { registry } = defineRegistry(catalog, {
  components: withStyleAll({
    page_root: PageRootRender,
    hero: HeroRender,
    hero_centered: HeroCenteredRender,
    hero_split_image: HeroSplitImageRender,
    hero_centered_signup: HeroCenteredSignupRender,
    hero_split_signup: HeroSplitSignupRender,
    hero_video: HeroVideoRender,
    nav_bar: NavBarRender,
    nav_centered_links: NavCenteredLinksRender,
    nav_centered_logo: NavCenteredLogoRender,
    nav_divided_links: NavDividedLinksRender,
    nav_with_icon_button: NavWithIconButtonRender,
    logo_wall: LogoWallRender,
    testimonial: TestimonialRender,
    testimonial_single_large: TestimonialSingleLargeRender,
    testimonial_three_column_avatar: TestimonialThreeColumnAvatarRender,
    testimonial_two_column_cards: TestimonialTwoColumnCardsRender,
    metric_proof: MetricProofRender,
    problem_statement: ProblemStatementRender,
    solution_overview: SolutionOverviewRender,
    feature_bento: FeatureBentoRender,
    feature_grid: FeatureGridRender,
    feature_tabs: FeatureTabsRender,
    feature_alternating: FeatureAlternatingRender,
    feature_checklist: FeatureChecklistRender,
    feature_icon_list: FeatureIconListRender,
    feature_link_columns: FeatureLinkColumnsRender,
    feature_with_screenshot: FeatureWithScreenshotRender,
    how_it_works: HowItWorksRender,
    step_numbered_icon_timeline: StepNumberedIconTimelineRender,
    step_tab_navigator: StepTabNavigatorRender,
    step_timeline_with_image: StepTimelineWithImageRender,
    pricing_table: PricingTableRender,
    pricing_comparison_table: PricingComparisonTableRender,
    pricing_toggle_billing: PricingToggleBillingRender,
    comparison_table: ComparisonTableRender,
    faq_accordion: FaqAccordionRender,
    trust_badges: TrustBadgesRender,
    lead_form: LeadFormRender,
    cta_banner: CtaBannerRender,
    cta_inline: CtaInlineRender,
    cta_email_capture: CtaEmailCaptureRender,
    cta_app_download: CtaAppDownloadRender,
    cta_sticky: CtaStickyRender,
    rich_text_block: RichTextBlockRender,
    gallery: GalleryRender,
    media: MediaRender,
    blog_article_grid: BlogArticleGridRender,
    map_location: MapLocationRender,
    countdown_timer: CountdownTimerRender,
    team_grid: TeamGridRender,
    team_bordered_cards: TeamBorderedCardsRender,
    team_grid_social: TeamGridSocialRender,
    team_profile_social: TeamProfileSocialRender,
    footer: FooterRender,
    footer_minimal_social: FooterMinimalSocialRender,
    footer_multi_column_social: FooterMultiColumnSocialRender,
    footer_columns_with_subscribe: FooterColumnsWithSubscribeRender,
    footer_columns_newsletter: FooterColumnsNewsletterRender,
    divider: DividerRender,
    spacer: SpacerRender,
    announcement_bar: AnnouncementBarRender,
    raw_html_block: RawHtmlBlockRender
  })
});
