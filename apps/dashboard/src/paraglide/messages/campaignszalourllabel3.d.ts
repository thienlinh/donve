export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignszalourllabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zalo group link" |
 *
 * @param {Campaignszalourllabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignszalourllabel3: ((
  inputs?: Campaignszalourllabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignszalourllabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignszalourllabel3 as "campaignsZaloUrlLabel" };
