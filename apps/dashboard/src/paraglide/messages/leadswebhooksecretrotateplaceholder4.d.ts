export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksecretrotateplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Leave blank to keep the current secret" |
 *
 * @param {Leadswebhooksecretrotateplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksecretrotateplaceholder4: ((
  inputs?: Leadswebhooksecretrotateplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksecretrotateplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksecretrotateplaceholder4 as "leadsWebhookSecretRotatePlaceholder" };
