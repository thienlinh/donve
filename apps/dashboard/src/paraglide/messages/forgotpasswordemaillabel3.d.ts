export type LocalizedString = import("../runtime.js").LocalizedString
export type Forgotpasswordemaillabel3Inputs = {}
/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Forgotpasswordemaillabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const forgotpasswordemaillabel3: ((
  inputs?: Forgotpasswordemaillabel3Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Forgotpasswordemaillabel3Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { forgotpasswordemaillabel3 as "forgotPasswordEmailLabel" }
