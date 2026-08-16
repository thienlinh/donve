export type LocalizedString = import("../runtime.js").LocalizedString
export type Verifiedtitle1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Email verified" |
 *
 * @param {Verifiedtitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const verifiedtitle1: ((
  inputs?: Verifiedtitle1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Verifiedtitle1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { verifiedtitle1 as "verifiedTitle" }
