export type LocalizedString = import("../runtime.js").LocalizedString
export type Signupemaillabel2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Signupemaillabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signupemaillabel2: ((
  inputs?: Signupemaillabel2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signupemaillabel2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { signupemaillabel2 as "signupEmailLabel" }
