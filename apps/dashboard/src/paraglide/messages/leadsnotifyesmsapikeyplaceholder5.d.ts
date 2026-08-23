export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmsapikeyplaceholder5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste your eSMS API key" |
 *
 * @param {Leadsnotifyesmsapikeyplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmsapikeyplaceholder5: ((
  inputs?: Leadsnotifyesmsapikeyplaceholder5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmsapikeyplaceholder5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmsapikeyplaceholder5 as "leadsNotifyEsmsApiKeyPlaceholder" };
