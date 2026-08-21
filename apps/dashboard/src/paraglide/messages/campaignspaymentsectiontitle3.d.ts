export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspaymentsectiontitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Payment" |
 *
 * @param {Campaignspaymentsectiontitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspaymentsectiontitle3: ((
  inputs?: Campaignspaymentsectiontitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspaymentsectiontitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspaymentsectiontitle3 as "campaignsPaymentSectionTitle" };
