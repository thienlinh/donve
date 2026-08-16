export type LocalizedString = import("../runtime.js").LocalizedString
export type Loginerror1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Incorrect email or password." |
 *
 * @param {Loginerror1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginerror1: ((
  inputs?: Loginerror1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginerror1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { loginerror1 as "loginError" }
