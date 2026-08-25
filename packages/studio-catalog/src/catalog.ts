import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { announcementBarPropsSchema } from "./components/announcement-bar.js";
import { comparisonTablePropsSchema } from "./components/comparison-table.js";
import { countdownTimerPropsSchema } from "./components/countdown-timer.js";
import { ctaBannerPropsSchema } from "./components/cta-banner.js";
import { ctaStickyPropsSchema } from "./components/cta-sticky.js";
import { dividerPropsSchema } from "./components/divider.js";
import { faqAccordionPropsSchema } from "./components/faq-accordion.js";
import { featureBentoPropsSchema } from "./components/feature-bento.js";
import { featureGridPropsSchema } from "./components/feature-grid.js";
import { featureTabsPropsSchema } from "./components/feature-tabs.js";
import { footerPropsSchema } from "./components/footer.js";
import { galleryPropsSchema } from "./components/gallery.js";
import { heroPropsSchema } from "./components/hero.js";
import { howItWorksPropsSchema } from "./components/how-it-works.js";
import { leadFormPropsSchema } from "./components/lead-form.js";
import { logoWallPropsSchema } from "./components/logo-wall.js";
import { mediaPropsSchema } from "./components/media.js";
import { metricProofPropsSchema } from "./components/metric-proof.js";
import { navBarPropsSchema } from "./components/nav-bar.js";
import { pageRootPropsSchema } from "./components/page-root.js";
import { pricingTablePropsSchema } from "./components/pricing-table.js";
import { problemStatementPropsSchema } from "./components/problem-statement.js";
import { rawHtmlBlockPropsSchema } from "./components/raw-html-block.js";
import { richTextBlockPropsSchema } from "./components/rich-text-block.js";
import { solutionOverviewPropsSchema } from "./components/solution-overview.js";
import { spacerPropsSchema } from "./components/spacer.js";
import { teamGridPropsSchema } from "./components/team-grid.js";
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
    nav_bar: {
      props: navBarPropsSchema,
      slots: [],
      description: "Site navigation bar with logo, links, optional CTA.",
      example: exampleProps.nav_bar
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
    how_it_works: {
      props: howItWorksPropsSchema,
      slots: [],
      description: "Numbered steps or timeline explaining the process.",
      example: exampleProps.how_it_works
    },
    pricing_table: {
      props: pricingTablePropsSchema,
      slots: [],
      description: "Pricing plans with feature lists and CTA per plan.",
      example: exampleProps.pricing_table
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
    footer: {
      props: footerPropsSchema,
      slots: [],
      description: "Site footer with links and optional newsletter signup.",
      example: exampleProps.footer
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
    // Pseudo-component (custom-import.md §Convert sang native) — no `example`, same reasoning
    // as `page_root`: not one of the ~25 taxonomy components offered for AI/manual insertion.
    raw_html_block: {
      props: rawHtmlBlockPropsSchema,
      slots: [],
      description:
        "Convert-to-native fallback: original markup preserved verbatim, no typed content fields."
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
 * on the dashboard side) — the shape is real at runtime, just not typed that way. Cast once
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
