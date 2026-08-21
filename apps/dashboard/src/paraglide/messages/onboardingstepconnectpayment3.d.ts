export type LocalizedString = import("../runtime.js").LocalizedString;
export type Onboardingstepconnectpayment3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect a payment provider to get paid automatically" |
 *
 * @param {Onboardingstepconnectpayment3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const onboardingstepconnectpayment3: ((
  inputs?: Onboardingstepconnectpayment3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Onboardingstepconnectpayment3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { onboardingstepconnectpayment3 as "onboardingStepConnectPayment" };
