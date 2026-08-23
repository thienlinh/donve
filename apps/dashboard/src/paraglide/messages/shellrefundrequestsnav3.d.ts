export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellrefundrequestsnav3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Refund requests" |
 *
 * @param {Shellrefundrequestsnav3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellrefundrequestsnav3: ((
  inputs?: Shellrefundrequestsnav3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellrefundrequestsnav3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellrefundrequestsnav3 as "shellRefundRequestsNav" };
