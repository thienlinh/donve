export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentapikeylabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Webhook API key" |
 *
 * @param {Paymentapikeylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentapikeylabel3: ((
  inputs?: Paymentapikeylabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentapikeylabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentapikeylabel3 as "paymentApiKeyLabel" };
