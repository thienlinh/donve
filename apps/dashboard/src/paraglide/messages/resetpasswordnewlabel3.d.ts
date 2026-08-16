export type LocalizedString = import("../runtime.js").LocalizedString
export type Resetpasswordnewlabel3Inputs = {}
/**
 * | output |
 * | --- |
 * | "New password" |
 *
 * @param {Resetpasswordnewlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const resetpasswordnewlabel3: ((
  inputs?: Resetpasswordnewlabel3Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Resetpasswordnewlabel3Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { resetpasswordnewlabel3 as "resetPasswordNewLabel" }
