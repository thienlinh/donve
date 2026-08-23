export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksettingsdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Configure a secret for this org to isolate its webhook from other orgs — optional, defaults to the platform's shared secret." |
 *
 * @param {Leadswebhooksettingsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksettingsdescription3: ((
  inputs?: Leadswebhooksettingsdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksettingsdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksettingsdescription3 as "leadsWebhookSettingsDescription" };
