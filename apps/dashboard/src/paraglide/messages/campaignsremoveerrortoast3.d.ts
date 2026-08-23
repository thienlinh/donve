export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsremoveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this campaign. Try again." |
 *
 * @param {Campaignsremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsremoveerrortoast3: ((
  inputs?: Campaignsremoveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsremoveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsremoveerrortoast3 as "campaignsRemoveErrorToast" };
