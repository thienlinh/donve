export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Funnels that connect products, landing pages, and checkout." |
 *
 * @param {Campaignsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsdescription1: ((
  inputs?: Campaignsdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsdescription1 as "campaignsDescription" };
