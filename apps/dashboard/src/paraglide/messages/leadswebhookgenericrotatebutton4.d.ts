export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgenericrotatebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Regenerate (revokes the old key)" |
 *
 * @param {Leadswebhookgenericrotatebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgenericrotatebutton4: ((
  inputs?: Leadswebhookgenericrotatebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgenericrotatebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgenericrotatebutton4 as "leadsWebhookGenericRotateButton" };
