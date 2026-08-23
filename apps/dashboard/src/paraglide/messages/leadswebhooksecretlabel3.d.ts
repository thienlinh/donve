export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksecretlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Secret (HMAC)" |
 *
 * @param {Leadswebhooksecretlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksecretlabel3: ((
  inputs?: Leadswebhooksecretlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksecretlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksecretlabel3 as "leadsWebhookSecretLabel" };
