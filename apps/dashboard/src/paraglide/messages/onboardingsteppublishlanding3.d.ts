export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingsteppublishlanding3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Publish a landing page" |
 *
 * @param {Onboardingsteppublishlanding3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingsteppublishlanding3: ((
  inputs?: Onboardingsteppublishlanding3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingsteppublishlanding3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingsteppublishlanding3 as "onboardingStepPublishLanding" };
