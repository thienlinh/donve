export type LocalizedString = import("../runtime.js").LocalizedString
export type Onboardingtitle1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Create your organization" |
 *
 * @param {Onboardingtitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingtitle1: ((
  inputs?: Onboardingtitle1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingtitle1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { onboardingtitle1 as "onboardingTitle" }
