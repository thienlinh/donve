export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookurllabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Webhook URL (paste into your Facebook/Zalo OA App)" |
 *
 * @param {Leadswebhookurllabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookurllabel3: ((
  inputs?: Leadswebhookurllabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookurllabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookurllabel3 as "leadsWebhookUrlLabel" };
