export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load leads" |
 *
 * @param {Leadsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsloaderrortitle3: ((
  inputs?: Leadsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsloaderrortitle3 as "leadsLoadErrorTitle" };
