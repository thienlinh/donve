export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsadddialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add a campaign" |
 *
 * @param {Campaignsadddialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsadddialogtitle3: ((
  inputs?: Campaignsadddialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsadddialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsadddialogtitle3 as "campaignsAddDialogTitle" };
