export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load custom domains" |
 *
 * @param {Domainsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsloaderrortitle3: ((
  inputs?: Domainsloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsloaderrortitle3 as "domainsLoadErrorTitle" };
