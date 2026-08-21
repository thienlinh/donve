export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignstransferprefixlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Transfer note prefix" |
 *
 * @param {Campaignstransferprefixlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignstransferprefixlabel3: ((
  inputs?: Campaignstransferprefixlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignstransferprefixlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignstransferprefixlabel3 as "campaignsTransferPrefixLabel" };
