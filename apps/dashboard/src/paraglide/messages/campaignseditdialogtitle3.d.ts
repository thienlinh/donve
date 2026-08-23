export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignseditdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit campaign" |
 *
 * @param {Campaignseditdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignseditdialogtitle3: ((
  inputs?: Campaignseditdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignseditdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignseditdialogtitle3 as "campaignsEditDialogTitle" };
