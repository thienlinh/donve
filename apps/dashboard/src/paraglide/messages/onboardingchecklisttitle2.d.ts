export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingchecklisttitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Get started" |
 *
 * @param {Onboardingchecklisttitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingchecklisttitle2: ((
  inputs?: Onboardingchecklisttitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingchecklisttitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingchecklisttitle2 as "onboardingChecklistTitle" };
