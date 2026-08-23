export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Last 30 days — views, submits, orders, and reconciled revenue." |
 *
 * @param {Campaignsanalyticsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsdescription2: ((
  inputs?: Campaignsanalyticsdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsdescription2 as "campaignsAnalyticsDescription" };
