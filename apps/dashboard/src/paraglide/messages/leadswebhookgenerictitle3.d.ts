export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgenerictitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Custom API (any other source)" |
 *
 * @param {Leadswebhookgenerictitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgenerictitle3: ((
  inputs?: Leadswebhookgenerictitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgenerictitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgenerictitle3 as "leadsWebhookGenericTitle" };
