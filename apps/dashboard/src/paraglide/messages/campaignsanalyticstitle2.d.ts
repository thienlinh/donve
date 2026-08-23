export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticstitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Campaign analytics" |
 *
 * @param {Campaignsanalyticstitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticstitle2: ((
  inputs?: Campaignsanalyticstitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticstitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticstitle2 as "campaignsAnalyticsTitle" };
