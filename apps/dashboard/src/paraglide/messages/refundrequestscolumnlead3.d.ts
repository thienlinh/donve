export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestscolumnlead3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Lead" |
 *
 * @param {Refundrequestscolumnlead3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestscolumnlead3: ((
  inputs?: Refundrequestscolumnlead3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestscolumnlead3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestscolumnlead3 as "refundRequestsColumnLead" };
