export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingorgnamelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Organization name" |
 *
 * @param {Onboardingorgnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingorgnamelabel3: ((
  inputs?: Onboardingorgnamelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingorgnamelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingorgnamelabel3 as "onboardingOrgNameLabel" };
