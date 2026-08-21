export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingchecklistdismiss2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Dismiss checklist" |
 *
 * @param {Onboardingchecklistdismiss2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingchecklistdismiss2: ((
  inputs?: Onboardingchecklistdismiss2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingchecklistdismiss2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingchecklistdismiss2 as "onboardingChecklistDismiss" };
