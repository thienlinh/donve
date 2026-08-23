export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsconversion2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Conversion" |
 *
 * @param {Campaignsanalyticsconversion2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsconversion2: ((
  inputs?: Campaignsanalyticsconversion2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsconversion2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsconversion2 as "campaignsAnalyticsConversion" };
