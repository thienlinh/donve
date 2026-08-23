export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookremovebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove, fall back to shared secret" |
 *
 * @param {Leadswebhookremovebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookremovebutton3: ((
  inputs?: Leadswebhookremovebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookremovebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookremovebutton3 as "leadsWebhookRemoveButton" };
