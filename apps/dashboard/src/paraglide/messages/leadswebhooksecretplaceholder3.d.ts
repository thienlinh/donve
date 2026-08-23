export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksecretplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste your Facebook App Secret / Zalo OA secret" |
 *
 * @param {Leadswebhooksecretplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksecretplaceholder3: ((
  inputs?: Leadswebhooksecretplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksecretplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksecretplaceholder3 as "leadsWebhookSecretPlaceholder" };
