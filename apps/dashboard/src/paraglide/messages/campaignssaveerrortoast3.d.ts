export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignssaveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this campaign. Try again." |
 *
 * @param {Campaignssaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignssaveerrortoast3: ((
  inputs?: Campaignssaveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignssaveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignssaveerrortoast3 as "campaignsSaveErrorToast" };
