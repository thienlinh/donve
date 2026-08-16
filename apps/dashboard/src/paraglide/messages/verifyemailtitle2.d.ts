export type LocalizedString = import("../runtime.js").LocalizedString
export type Verifyemailtitle2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Check your email" |
 *
 * @param {Verifyemailtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const verifyemailtitle2: ((
  inputs?: Verifyemailtitle2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Verifyemailtitle2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { verifyemailtitle2 as "verifyEmailTitle" }
