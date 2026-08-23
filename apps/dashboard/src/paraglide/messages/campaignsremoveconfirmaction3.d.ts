export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsremoveconfirmaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove campaign" |
 *
 * @param {Campaignsremoveconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsremoveconfirmaction3: ((
  inputs?: Campaignsremoveconfirmaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsremoveconfirmaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsremoveconfirmaction3 as "campaignsRemoveConfirmAction" };
