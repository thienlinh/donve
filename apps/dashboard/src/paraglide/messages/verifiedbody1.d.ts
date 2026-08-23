export type LocalizedString = import("../runtime.js").LocalizedString;
export type Verifiedbody1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Your email has been verified. You can log in now." |
 *
 * @param {Verifiedbody1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const verifiedbody1: ((
  inputs?: Verifiedbody1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Verifiedbody1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { verifiedbody1 as "verifiedBody" };
