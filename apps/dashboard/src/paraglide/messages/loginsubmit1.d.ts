export type LocalizedString = import("../runtime.js").LocalizedString
export type Loginsubmit1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Log in" |
 *
 * @param {Loginsubmit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginsubmit1: ((
  inputs?: Loginsubmit1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginsubmit1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { loginsubmit1 as "loginSubmit" }
