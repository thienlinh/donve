export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksaveerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed to save webhook" |
 *
 * @param {Leadswebhooksaveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksaveerrortoast4: ((
  inputs?: Leadswebhooksaveerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksaveerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksaveerrortoast4 as "leadsWebhookSaveErrorToast" };
