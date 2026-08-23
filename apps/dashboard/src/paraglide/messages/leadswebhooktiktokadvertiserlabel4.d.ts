export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooktiktokadvertiserlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connected advertiser account" |
 *
 * @param {Leadswebhooktiktokadvertiserlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooktiktokadvertiserlabel4: ((
  inputs?: Leadswebhooktiktokadvertiserlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooktiktokadvertiserlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooktiktokadvertiserlabel4 as "leadsWebhookTiktokAdvertiserLabel" };
