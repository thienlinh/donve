export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingchecklistsubtitle2Inputs = {
  done: NonNullable<unknown>;
  total: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{done}/{total} steps done" |
 *
 * @param {Onboardingchecklistsubtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingchecklistsubtitle2: ((
  inputs: Onboardingchecklistsubtitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingchecklistsubtitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingchecklistsubtitle2 as "onboardingChecklistSubtitle" };
