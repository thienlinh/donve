export type LocalizedString = import("../runtime.js").LocalizedString
export type Forgotpasswordtitle2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Forgot password" |
 *
 * @param {Forgotpasswordtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const forgotpasswordtitle2: ((
  inputs?: Forgotpasswordtitle2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Forgotpasswordtitle2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { forgotpasswordtitle2 as "forgotPasswordTitle" }
