export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingsubmit1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Create organization" |
 *
 * @param {Onboardingsubmit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingsubmit1: ((
  inputs?: Onboardingsubmit1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingsubmit1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingsubmit1 as "onboardingSubmit" };
