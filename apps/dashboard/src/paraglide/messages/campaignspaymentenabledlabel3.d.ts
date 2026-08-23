export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspaymentenabledlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Enabled" |
 *
 * @param {Campaignspaymentenabledlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspaymentenabledlabel3: ((
  inputs?: Campaignspaymentenabledlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspaymentenabledlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspaymentenabledlabel3 as "campaignsPaymentEnabledLabel" };
