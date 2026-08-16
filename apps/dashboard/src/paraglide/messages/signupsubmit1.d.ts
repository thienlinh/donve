export type LocalizedString = import("../runtime.js").LocalizedString
export type Signupsubmit1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Sign up" |
 *
 * @param {Signupsubmit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signupsubmit1: ((
  inputs?: Signupsubmit1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signupsubmit1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { signupsubmit1 as "signupSubmit" }
