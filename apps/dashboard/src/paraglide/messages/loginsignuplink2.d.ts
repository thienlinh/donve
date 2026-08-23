export type LocalizedString = import("../runtime.js").LocalizedString;
export type Loginsignuplink2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sign up" |
 *
 * @param {Loginsignuplink2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginsignuplink2: ((
  inputs?: Loginsignuplink2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginsignuplink2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { loginsignuplink2 as "loginSignupLink" };
