import { catalogComponents } from "./catalog.js";
import type { ComponentMeta } from "./component-meta.js";
import { announcementBarMeta } from "./components/announcement-bar.js";
import { blogArticleGridMeta } from "./components/blog-article-grid.js";
import { comparisonTableMeta } from "./components/comparison-table.js";
import { countdownTimerMeta } from "./components/countdown-timer.js";
import { ctaAppDownloadMeta } from "./components/cta-app-download.js";
import { ctaBannerMeta } from "./components/cta-banner.js";
import { ctaEmailCaptureMeta } from "./components/cta-email-capture.js";
import { ctaInlineMeta } from "./components/cta-inline.js";
import { ctaStickyMeta } from "./components/cta-sticky.js";
import { dividerMeta } from "./components/divider.js";
import { faqAccordionMeta } from "./components/faq-accordion.js";
import { featureAlternatingMeta } from "./components/feature-alternating.js";
import { featureBentoMeta } from "./components/feature-bento.js";
import { featureChecklistMeta } from "./components/feature-checklist.js";
import { featureGridMeta } from "./components/feature-grid.js";
import { featureIconListMeta } from "./components/feature-icon-list.js";
import { featureLinkColumnsMeta } from "./components/feature-link-columns.js";
import { featureTabsMeta } from "./components/feature-tabs.js";
import { featureWithScreenshotMeta } from "./components/feature-with-screenshot.js";
import { footerColumnsNewsletterMeta } from "./components/footer-columns-newsletter.js";
import { footerColumnsWithSubscribeMeta } from "./components/footer-columns-with-subscribe.js";
import { footerMinimalSocialMeta } from "./components/footer-minimal-social.js";
import { footerMultiColumnSocialMeta } from "./components/footer-multi-column-social.js";
import { footerMeta } from "./components/footer.js";
import { galleryMeta } from "./components/gallery.js";
import { heroCenteredSignupMeta } from "./components/hero-centered-signup.js";
import { heroCenteredMeta } from "./components/hero-centered.js";
import { heroSplitImageMeta } from "./components/hero-split-image.js";
import { heroSplitSignupMeta } from "./components/hero-split-signup.js";
import { heroVideoMeta } from "./components/hero-video.js";
import { heroMeta } from "./components/hero.js";
import { howItWorksMeta } from "./components/how-it-works.js";
import { leadFormMeta } from "./components/lead-form.js";
import { logoWallMeta } from "./components/logo-wall.js";
import { mapLocationMeta } from "./components/map-location.js";
import { mediaMeta } from "./components/media.js";
import { metricProofMeta } from "./components/metric-proof.js";
import { navBarMeta } from "./components/nav-bar.js";
import { navCenteredLinksMeta } from "./components/nav-centered-links.js";
import { navCenteredLogoMeta } from "./components/nav-centered-logo.js";
import { navDividedLinksMeta } from "./components/nav-divided-links.js";
import { navWithIconButtonMeta } from "./components/nav-with-icon-button.js";
import { pricingComparisonTableMeta } from "./components/pricing-comparison-table.js";
import { pricingTableMeta } from "./components/pricing-table.js";
import { pricingToggleBillingMeta } from "./components/pricing-toggle-billing.js";
import { problemStatementMeta } from "./components/problem-statement.js";
import { rawHtmlBlockMeta } from "./components/raw-html-block.js";
import { richTextBlockMeta } from "./components/rich-text-block.js";
import { solutionOverviewMeta } from "./components/solution-overview.js";
import { spacerMeta } from "./components/spacer.js";
import { stepNumberedIconTimelineMeta } from "./components/step-numbered-icon-timeline.js";
import { stepTabNavigatorMeta } from "./components/step-tab-navigator.js";
import { stepTimelineWithImageMeta } from "./components/step-timeline-with-image.js";
import { teamBorderedCardsMeta } from "./components/team-bordered-cards.js";
import { teamGridSocialMeta } from "./components/team-grid-social.js";
import { teamGridMeta } from "./components/team-grid.js";
import { teamProfileSocialMeta } from "./components/team-profile-social.js";
import { testimonialSingleLargeMeta } from "./components/testimonial-single-large.js";
import { testimonialThreeColumnAvatarMeta } from "./components/testimonial-three-column-avatar.js";
import { testimonialTwoColumnCardsMeta } from "./components/testimonial-two-column-cards.js";
import { testimonialMeta } from "./components/testimonial.js";
import { trustBadgesMeta } from "./components/trust-badges.js";

/** `componentRegistry` seed data — platform metadata per componentId (`architecture-and-data-model.md`). */
export const componentMetadata: readonly ComponentMeta[] = [
  heroMeta,
  heroCenteredMeta,
  heroSplitImageMeta,
  heroCenteredSignupMeta,
  heroSplitSignupMeta,
  heroVideoMeta,
  navBarMeta,
  navCenteredLinksMeta,
  navCenteredLogoMeta,
  navDividedLinksMeta,
  navWithIconButtonMeta,
  logoWallMeta,
  testimonialMeta,
  testimonialSingleLargeMeta,
  testimonialThreeColumnAvatarMeta,
  testimonialTwoColumnCardsMeta,
  metricProofMeta,
  problemStatementMeta,
  solutionOverviewMeta,
  featureBentoMeta,
  featureGridMeta,
  featureTabsMeta,
  featureAlternatingMeta,
  featureChecklistMeta,
  featureIconListMeta,
  featureLinkColumnsMeta,
  featureWithScreenshotMeta,
  howItWorksMeta,
  stepNumberedIconTimelineMeta,
  stepTabNavigatorMeta,
  stepTimelineWithImageMeta,
  pricingTableMeta,
  pricingComparisonTableMeta,
  pricingToggleBillingMeta,
  comparisonTableMeta,
  faqAccordionMeta,
  trustBadgesMeta,
  leadFormMeta,
  ctaBannerMeta,
  ctaInlineMeta,
  ctaEmailCaptureMeta,
  ctaAppDownloadMeta,
  ctaStickyMeta,
  richTextBlockMeta,
  galleryMeta,
  mediaMeta,
  blogArticleGridMeta,
  mapLocationMeta,
  countdownTimerMeta,
  teamGridMeta,
  teamBorderedCardsMeta,
  teamGridSocialMeta,
  teamProfileSocialMeta,
  footerMeta,
  footerMinimalSocialMeta,
  footerMultiColumnSocialMeta,
  footerColumnsWithSubscribeMeta,
  footerColumnsNewsletterMeta,
  dividerMeta,
  spacerMeta,
  announcementBarMeta,
  rawHtmlBlockMeta
];

export const componentMetaById = new Map(
  componentMetadata.map((meta) => [meta.componentId, meta])
);

/**
 * The catalog as the AI agents see it (`@dv/studio-ai`'s `CatalogComponentSummary`) — plain
 * data, so `studio-ai` never has to import this React-flavoured package. `page_root` (never
 * chosen, it's the container) and `raw_html_block` (verbatim-markup fallback, not a real
 * taxonomy component) are excluded: neither is something an agent may propose.
 */
export const architectCatalogSummary = componentMetadata
  .filter(
    (meta) =>
      meta.componentId !== "page_root" && meta.componentId !== "raw_html_block"
  )
  .map((meta) => ({
    componentId: meta.componentId,
    category: meta.category,
    purpose: meta.purpose,
    variants: meta.variants,
    description: catalogComponents[meta.componentId]?.description ?? ""
  }));
