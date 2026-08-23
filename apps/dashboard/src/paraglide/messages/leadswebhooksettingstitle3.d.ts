export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksettingstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Lead webhooks (Facebook/Zalo)" |
 *
 * @param {Leadswebhooksettingstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksettingstitle3: ((
  inputs?: Leadswebhooksettingstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksettingstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksettingstitle3 as "leadsWebhookSettingsTitle" };
