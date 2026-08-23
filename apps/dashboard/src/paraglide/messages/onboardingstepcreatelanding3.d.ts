export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingstepcreatelanding3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Create your first landing page" |
 *
 * @param {Onboardingstepcreatelanding3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingstepcreatelanding3: ((
  inputs?: Onboardingstepcreatelanding3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingstepcreatelanding3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingstepcreatelanding3 as "onboardingStepCreateLanding" };
