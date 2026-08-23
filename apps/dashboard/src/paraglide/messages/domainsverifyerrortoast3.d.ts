export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsverifyerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't check verification status. Try again." |
 *
 * @param {Domainsverifyerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsverifyerrortoast3: ((
  inputs?: Domainsverifyerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsverifyerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsverifyerrortoast3 as "domainsVerifyErrorToast" };
