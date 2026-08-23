export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsutmremovelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove parameter" |
 *
 * @param {Campaignsutmremovelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsutmremovelabel3: ((
  inputs?: Campaignsutmremovelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsutmremovelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsutmremovelabel3 as "campaignsUtmRemoveLabel" };
