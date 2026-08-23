export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingstepconnectai3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect an AI provider for unlimited generation" |
 *
 * @param {Onboardingstepconnectai3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingstepconnectai3: ((
  inputs?: Onboardingstepconnectai3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingstepconnectai3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingstepconnectai3 as "onboardingStepConnectAi" };
