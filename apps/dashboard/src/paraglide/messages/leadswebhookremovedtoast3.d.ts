export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhookremovedtoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Removed — this org now uses the shared secret" |
 *
 * @param {Leadswebhookremovedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhookremovedtoast3: ((
  inputs?: Leadswebhookremovedtoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhookremovedtoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhookremovedtoast3 as "leadsWebhookRemovedToast" };
