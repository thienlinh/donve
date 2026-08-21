export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainslandingpageplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Choose a published landing page" |
 *
 * @param {Domainslandingpageplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainslandingpageplaceholder3: ((
  inputs?: Domainslandingpageplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainslandingpageplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainslandingpageplaceholder3 as "domainsLandingPagePlaceholder" };
