export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmsapikeylabel5Inputs = {};
/**
 * | output |
 * | --- |
 * | "API key" |
 *
 * @param {Leadsnotifyesmsapikeylabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmsapikeylabel5: ((
  inputs?: Leadsnotifyesmsapikeylabel5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmsapikeylabel5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmsapikeylabel5 as "leadsNotifyEsmsApiKeyLabel" };
