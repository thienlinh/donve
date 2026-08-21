export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsanalyticsorders2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Orders" |
 *
 * @param {Campaignsanalyticsorders2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsanalyticsorders2: ((
  inputs?: Campaignsanalyticsorders2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsanalyticsorders2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsanalyticsorders2 as "campaignsAnalyticsOrders" };
