export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookgenericdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Use for any lead source with no dedicated integration above (a Zalo Mini App bridge server, a custom CRM, an automation tool...). Authenticated by a plain AP..." |
 *
 * @param {Leadswebhookgenericdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookgenericdescription3: ((
  inputs?: Leadswebhookgenericdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookgenericdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookgenericdescription3 as "leadsWebhookGenericDescription" };
