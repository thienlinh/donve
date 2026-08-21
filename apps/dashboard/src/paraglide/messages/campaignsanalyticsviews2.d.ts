export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsviews2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Views" |
 *
 * @param {Campaignsanalyticsviews2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsviews2: ((
  inputs?: Campaignsanalyticsviews2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsviews2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsviews2 as "campaignsAnalyticsViews" };
