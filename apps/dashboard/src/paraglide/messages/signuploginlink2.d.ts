export type LocalizedString = import("../runtime.js").LocalizedString
export type Signuploginlink2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Log in" |
 *
 * @param {Signuploginlink2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signuploginlink2: ((
  inputs?: Signuploginlink2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signuploginlink2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { signuploginlink2 as "signupLoginLink" }
