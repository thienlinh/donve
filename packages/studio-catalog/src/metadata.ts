import { catalogComponents } from "./catalog.js";
import type { ComponentMeta } from "./component-meta.js";
import { announcementBarMeta } from "./components/announcement-bar.js";
import { comparisonTableMeta } from "./components/comparison-table.js";
import { countdownTimerMeta } from "./components/countdown-timer.js";
import { ctaBannerMeta } from "./components/cta-banner.js";
import { ctaStickyMeta } from "./components/cta-sticky.js";
import { dividerMeta } from "./components/divider.js";
import { faqAccordionMeta } from "./components/faq-accordion.js";
import { featureBentoMeta } from "./components/feature-bento.js";
import { featureGridMeta } from "./components/feature-grid.js";
import { featureTabsMeta } from "./components/feature-tabs.js";
import { footerMeta } from "./components/footer.js";
import { galleryMeta } from "./components/gallery.js";
import { heroMeta } from "./components/hero.js";
import { howItWorksMeta } from "./components/how-it-works.js";
import { leadFormMeta } from "./components/lead-form.js";
import { logoWallMeta } from "./components/logo-wall.js";
import { mediaMeta } from "./components/media.js";
import { metricProofMeta } from "./components/metric-proof.js";
import { navBarMeta } from "./components/nav-bar.js";
import { pricingTableMeta } from "./components/pricing-table.js";
import { problemStatementMeta } from "./components/problem-statement.js";
import { rawHtmlBlockMeta } from "./components/raw-html-block.js";
import { richTextBlockMeta } from "./components/rich-text-block.js";
import { solutionOverviewMeta } from "./components/solution-overview.js";
import { spacerMeta } from "./components/spacer.js";
import { teamGridMeta } from "./components/team-grid.js";
import { testimonialMeta } from "./components/testimonial.js";
import { trustBadgesMeta } from "./components/trust-badges.js";

/** `componentRegistry` seed data — platform metadata per componentId (`architecture-and-data-model.md`). */
export const componentMetadata: readonly ComponentMeta[] = [
  heroMeta,
  navBarMeta,
  logoWallMeta,
  testimonialMeta,
  metricProofMeta,
  problemStatementMeta,
  solutionOverviewMeta,
  featureBentoMeta,
  featureGridMeta,
  featureTabsMeta,
  howItWorksMeta,
  pricingTableMeta,
  comparisonTableMeta,
  faqAccordionMeta,
  trustBadgesMeta,
  leadFormMeta,
  ctaBannerMeta,
  ctaStickyMeta,
  richTextBlockMeta,
  galleryMeta,
  mediaMeta,
  countdownTimerMeta,
  teamGridMeta,
  footerMeta,
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
 * chosen, it's the container) and `raw_html_block` (convert-to-native's own fallback target)
 * are excluded: neither is something an agent may propose.
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
