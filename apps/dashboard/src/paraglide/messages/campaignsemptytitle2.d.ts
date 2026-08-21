export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsemptytitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No campaigns yet" |
 *
 * @param {Campaignsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsemptytitle2: ((
  inputs?: Campaignsemptytitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsemptytitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsemptytitle2 as "campaignsEmptyTitle" };
