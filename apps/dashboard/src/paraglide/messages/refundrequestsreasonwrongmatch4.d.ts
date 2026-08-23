export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsreasonwrongmatch4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Wrong order match" |
 *
 * @param {Refundrequestsreasonwrongmatch4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsreasonwrongmatch4: ((
  inputs?: Refundrequestsreasonwrongmatch4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsreasonwrongmatch4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsreasonwrongmatch4 as "refundRequestsReasonWrongMatch" };
