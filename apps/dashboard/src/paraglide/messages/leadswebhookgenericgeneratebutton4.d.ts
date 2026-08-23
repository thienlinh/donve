export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgenericgeneratebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Generate API Key" |
 *
 * @param {Leadswebhookgenericgeneratebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgenericgeneratebutton4: ((
  inputs?: Leadswebhookgenericgeneratebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgenericgeneratebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgenericgeneratebutton4 as "leadsWebhookGenericGenerateButton" };
