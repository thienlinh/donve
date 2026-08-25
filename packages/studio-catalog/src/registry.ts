import { defineRegistry } from "@json-render/react";

import { catalog } from "./catalog.js";
import { AnnouncementBarRender } from "./components/announcement-bar.js";
import { ComparisonTableRender } from "./components/comparison-table.js";
import { CountdownTimerRender } from "./components/countdown-timer.js";
import { CtaBannerRender } from "./components/cta-banner.js";
import { CtaStickyRender } from "./components/cta-sticky.js";
import { DividerRender } from "./components/divider.js";
import { FaqAccordionRender } from "./components/faq-accordion.js";
import { FeatureBentoRender } from "./components/feature-bento.js";
import { FeatureGridRender } from "./components/feature-grid.js";
import { FeatureTabsRender } from "./components/feature-tabs.js";
import { FooterRender } from "./components/footer.js";
import { GalleryRender } from "./components/gallery.js";
import { HeroRender } from "./components/hero.js";
import { HowItWorksRender } from "./components/how-it-works.js";
import { LeadFormRender } from "./components/lead-form.js";
import { LogoWallRender } from "./components/logo-wall.js";
import { MediaRender } from "./components/media.js";
import { MetricProofRender } from "./components/metric-proof.js";
import { NavBarRender } from "./components/nav-bar.js";
import { PageRootRender } from "./components/page-root.js";
import { PricingTableRender } from "./components/pricing-table.js";
import { ProblemStatementRender } from "./components/problem-statement.js";
import { RawHtmlBlockRender } from "./components/raw-html-block.js";
import { RichTextBlockRender } from "./components/rich-text-block.js";
import { SolutionOverviewRender } from "./components/solution-overview.js";
import { SpacerRender } from "./components/spacer.js";
import { TeamGridRender } from "./components/team-grid.js";
import { TestimonialRender } from "./components/testimonial.js";
import { TrustBadgesRender } from "./components/trust-badges.js";

export const { registry } = defineRegistry(catalog, {
  components: {
    page_root: PageRootRender,
    hero: HeroRender,
    nav_bar: NavBarRender,
    logo_wall: LogoWallRender,
    testimonial: TestimonialRender,
    metric_proof: MetricProofRender,
    problem_statement: ProblemStatementRender,
    solution_overview: SolutionOverviewRender,
    feature_bento: FeatureBentoRender,
    feature_grid: FeatureGridRender,
    feature_tabs: FeatureTabsRender,
    how_it_works: HowItWorksRender,
    pricing_table: PricingTableRender,
    comparison_table: ComparisonTableRender,
    faq_accordion: FaqAccordionRender,
    trust_badges: TrustBadgesRender,
    lead_form: LeadFormRender,
    cta_banner: CtaBannerRender,
    cta_sticky: CtaStickyRender,
    rich_text_block: RichTextBlockRender,
    gallery: GalleryRender,
    media: MediaRender,
    countdown_timer: CountdownTimerRender,
    team_grid: TeamGridRender,
    footer: FooterRender,
    divider: DividerRender,
    spacer: SpacerRender,
    announcement_bar: AnnouncementBarRender,
    raw_html_block: RawHtmlBlockRender
  }
});
