export type LocalizedString = import("../runtime.js").LocalizedString
export type Forgotpasswordsubmit2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Send link" |
 *
 * @param {Forgotpasswordsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const forgotpasswordsubmit2: ((
  inputs?: Forgotpasswordsubmit2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Forgotpasswordsubmit2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { forgotpasswordsubmit2 as "forgotPasswordSubmit" }
