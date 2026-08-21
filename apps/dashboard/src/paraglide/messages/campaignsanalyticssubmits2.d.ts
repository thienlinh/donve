export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticssubmits2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Submits" |
 *
 * @param {Campaignsanalyticssubmits2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticssubmits2: ((
  inputs?: Campaignsanalyticssubmits2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticssubmits2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticssubmits2 as "campaignsAnalyticsSubmits" };
