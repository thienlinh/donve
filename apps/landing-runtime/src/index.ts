import { sendEvent } from "./beacon.js";
import { readConfig } from "./config.js";
import { bindCountdowns } from "./countdown.js";
import { bindLeadForms } from "./lead-form.js";
import { bindTrackedClicks, bindViewportTracking } from "./tracking.js";
import { utmFromLocation } from "./utm.js";

// Needs no runtime config (no beacon, no API) — bound unconditionally.
bindCountdowns();

const config = readConfig();
if (config) {
  bindLeadForms(config);
  bindTrackedClicks(config);
  bindViewportTracking(config);
  // "view" kept for the legacy campaign-analytics dashboard's `views` bucket; "page_viewed" is
  // the new conversion-hierarchy name (`tracking-and-attribution.md`), carrying first-touch UTM.
  sendEvent(config, "view", { campaignId: config.campaignId });
  sendEvent(config, "page_viewed", {
    campaignId: config.campaignId,
    utm: utmFromLocation()
  });
}
