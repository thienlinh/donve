export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooktiktokconnectbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect TikTok Ads account" |
 *
 * @param {Leadswebhooktiktokconnectbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooktiktokconnectbutton4: ((
  inputs?: Leadswebhooktiktokconnectbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooktiktokconnectbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooktiktokconnectbutton4 as "leadsWebhookTiktokConnectButton" };
