export type LocalizedString = import("../runtime.js").LocalizedString
export type Signuppasswordlabel2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Password" |
 *
 * @param {Signuppasswordlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signuppasswordlabel2: ((
  inputs?: Signuppasswordlabel2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signuppasswordlabel2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { signuppasswordlabel2 as "signupPasswordLabel" }
