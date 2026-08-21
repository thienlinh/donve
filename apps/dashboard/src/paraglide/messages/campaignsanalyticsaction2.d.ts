export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsaction2Inputs = {};
/**
 * | output |
 * | --- |
 * | "View analytics" |
 *
 * @param {Campaignsanalyticsaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsaction2: ((
  inputs?: Campaignsanalyticsaction2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsaction2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsaction2 as "campaignsAnalyticsAction" };
