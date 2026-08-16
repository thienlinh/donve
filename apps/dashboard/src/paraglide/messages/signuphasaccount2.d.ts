export type LocalizedString = import("../runtime.js").LocalizedString
export type Signuphasaccount2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Already have an account?" |
 *
 * @param {Signuphasaccount2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signuphasaccount2: ((
  inputs?: Signuphasaccount2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signuphasaccount2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { signuphasaccount2 as "signupHasAccount" }
