export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsendsatlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Ends" |
 *
 * @param {Campaignsendsatlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsendsatlabel3: ((
  inputs?: Campaignsendsatlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsendsatlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsendsatlabel3 as "campaignsEndsAtLabel" };
