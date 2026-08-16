export type LocalizedString = import("../runtime.js").LocalizedString;
export type Verifiedloginlink2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Go to login" |
 *
 * @param {Verifiedloginlink2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const verifiedloginlink2: ((
  inputs?: Verifiedloginlink2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Verifiedloginlink2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { verifiedloginlink2 as "verifiedLoginLink" };
