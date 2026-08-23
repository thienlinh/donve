export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsmarktransferredbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Mark refund as transferred" |
 *
 * @param {Refundrequestsmarktransferredbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsmarktransferredbutton4: ((
  inputs?: Refundrequestsmarktransferredbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsmarktransferredbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsmarktransferredbutton4 as "refundRequestsMarkTransferredButton" };
