export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksavedtoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Webhook saved" |
 *
 * @param {Leadswebhooksavedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksavedtoast3: ((
  inputs?: Leadswebhooksavedtoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksavedtoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksavedtoast3 as "leadsWebhookSavedToast" };
