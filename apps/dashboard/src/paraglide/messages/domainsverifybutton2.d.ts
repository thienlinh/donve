export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsverifybutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Check verification status" |
 *
 * @param {Domainsverifybutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsverifybutton2: ((
  inputs?: Domainsverifybutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsverifybutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsverifybutton2 as "domainsVerifyButton" };
