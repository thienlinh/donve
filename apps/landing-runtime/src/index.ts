import { sendEvent } from "./beacon.js";
import { readConfig } from "./config.js";
import { bindLeadForms } from "./lead-form.js";

const config = readConfig();
if (config) {
  bindLeadForms(config);
  sendEvent(config, "view", { campaignId: config.campaignId });
}
