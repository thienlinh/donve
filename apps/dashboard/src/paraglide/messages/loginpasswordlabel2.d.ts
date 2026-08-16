export type LocalizedString = import("../runtime.js").LocalizedString
export type Loginpasswordlabel2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Password" |
 *
 * @param {Loginpasswordlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginpasswordlabel2: ((
  inputs?: Loginpasswordlabel2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginpasswordlabel2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { loginpasswordlabel2 as "loginPasswordLabel" }
