export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgoogleadsdescription4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste the URL and key below into your Lead Form asset's own webhook settings in Google Ads — Google sends every new lead here in real time, no polling or thi..." |
 *
 * @param {Leadswebhookgoogleadsdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgoogleadsdescription4: ((
  inputs?: Leadswebhookgoogleadsdescription4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgoogleadsdescription4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgoogleadsdescription4 as "leadsWebhookGoogleAdsDescription" };
