export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsrevenue2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Revenue (VND)" |
 *
 * @param {Campaignsanalyticsrevenue2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsrevenue2: ((
  inputs?: Campaignsanalyticsrevenue2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsrevenue2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsrevenue2 as "campaignsAnalyticsRevenue" };
