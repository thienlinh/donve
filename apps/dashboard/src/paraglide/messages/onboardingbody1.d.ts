export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingbody1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Every Donve account belongs to at least one organization — this is where your landing pages, campaigns, and leads live." |
 *
 * @param {Onboardingbody1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingbody1: ((
  inputs?: Onboardingbody1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingbody1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingbody1 as "onboardingBody" };
