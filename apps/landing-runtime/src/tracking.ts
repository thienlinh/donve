import { sendEvent } from "./beacon.js";
import type { RuntimeConfig } from "./config.js";

/**
 * `tracking-and-attribution.md` §Event naming — wires up the `data-lp-track` markers every
 * catalog component already renders (`packages/studio-catalog/src/tracking.ts`'s `trackAttr`),
 * plus the 2 structural events no component declares by name: `section_viewed` (any
 * `data-lp-component` root entering view — the natural per-section hook, not a per-component
 * opt-in like the others) and `outbound_link_clicked` (auto-detected from a clicked `<a>`'s own
 * href, not a marker). `form_started`/`form_submitted` fire from `lead-form.ts`'s own bound
 * handlers instead.
 */
const VIEWPORT_TRIGGERED_EVENTS = new Set(["pricing_viewed"]);
const VIEWPORT_THRESHOLD = 0.5;

function trackedEventNames(el: Element): string[] {
  return (el.getAttribute("data-lp-track") ?? "").split(/\s+/).filter(Boolean);
}

export function bindTrackedClicks(config: RuntimeConfig): void {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const anchor = event.target.closest("a[href]");
    if (anchor) {
      const href = anchor.getAttribute("href") ?? "";
      try {
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) {
          sendEvent(config, "outbound_link_clicked", {
            campaignId: config.campaignId,
            href: url.href
          });
        }
      } catch {
        // relative/unparsable href — not an outbound link.
      }
    }

    const tracked = event.target.closest<HTMLElement>("[data-lp-track]");
    if (!tracked) return;
    for (const eventName of trackedEventNames(tracked)) {
      if (eventName === "cta_clicked") {
        sendEvent(config, eventName, { campaignId: config.campaignId });
      }
    }
  });

  for (const details of document.querySelectorAll<HTMLDetailsElement>(
    'details[data-lp-track~="faq_opened"]'
  )) {
    details.addEventListener("toggle", () => {
      if (details.open) {
        sendEvent(config, "faq_opened", { campaignId: config.campaignId });
      }
    });
  }
}

/** `pricing_viewed` (declared per-component via `data-lp-track`) and `section_viewed` (every
 * `data-lp-component` root, unconditionally) — both fire once, the first time at least half the
 * element is visible. No-op in any environment without `IntersectionObserver` (never true in a
 * real browser, only relevant for a non-DOM test harness). */
export function bindViewportTracking(config: RuntimeConfig): void {
  if (typeof IntersectionObserver === "undefined") return;

  const pricingObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        for (const eventName of trackedEventNames(entry.target)) {
          if (VIEWPORT_TRIGGERED_EVENTS.has(eventName)) {
            sendEvent(config, eventName, { campaignId: config.campaignId });
          }
        }
      }
    },
    { threshold: VIEWPORT_THRESHOLD }
  );
  for (const el of document.querySelectorAll("[data-lp-track]")) {
    if (
      trackedEventNames(el).some((name) => VIEWPORT_TRIGGERED_EVENTS.has(name))
    ) {
      pricingObserver.observe(el);
    }
  }

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        sendEvent(config, "section_viewed", {
          campaignId: config.campaignId,
          component: entry.target.getAttribute("data-lp-component")
        });
      }
    },
    { threshold: VIEWPORT_THRESHOLD }
  );
  for (const el of document.querySelectorAll("[data-lp-component]")) {
    sectionObserver.observe(el);
  }
}
