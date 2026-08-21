export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load campaigns" |
 *
 * @param {Campaignsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsloaderrortitle3: ((
  inputs?: Campaignsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsloaderrortitle3 as "campaignsLoadErrorTitle" };
