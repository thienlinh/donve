export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load analytics" |
 *
 * @param {Campaignsanalyticsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsloaderrortitle4: ((
  inputs?: Campaignsanalyticsloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsloaderrortitle4 as "campaignsAnalyticsLoadErrorTitle" };
