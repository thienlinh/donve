export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookcarddescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "A dedicated secret isolates this org from others sharing one central App." |
 *
 * @param {Leadswebhookcarddescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookcarddescription3: ((
  inputs?: Leadswebhookcarddescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookcarddescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookcarddescription3 as "leadsWebhookCardDescription" };
