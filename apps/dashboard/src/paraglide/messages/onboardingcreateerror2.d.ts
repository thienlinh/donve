export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingcreateerror2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't create your organization. Try again." |
 *
 * @param {Onboardingcreateerror2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingcreateerror2: ((
  inputs?: Onboardingcreateerror2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingcreateerror2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingcreateerror2 as "onboardingCreateError" };
