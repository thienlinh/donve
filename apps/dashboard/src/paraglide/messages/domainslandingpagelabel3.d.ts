export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainslandingpagelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Landing page" |
 *
 * @param {Domainslandingpagelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainslandingpagelabel3: ((
  inputs?: Domainslandingpagelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainslandingpagelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainslandingpagelabel3 as "domainsLandingPageLabel" };
