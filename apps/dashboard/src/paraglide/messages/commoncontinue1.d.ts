export type LocalizedString = import("../runtime.js").LocalizedString
export type Commoncontinue1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Continue" |
 *
 * @param {Commoncontinue1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commoncontinue1: ((
  inputs?: Commoncontinue1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commoncontinue1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { commoncontinue1 as "commonContinue" }
