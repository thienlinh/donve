export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmssecretkeyplaceholder5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste your eSMS secret key" |
 *
 * @param {Leadsnotifyesmssecretkeyplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmssecretkeyplaceholder5: ((
  inputs?: Leadsnotifyesmssecretkeyplaceholder5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmssecretkeyplaceholder5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmssecretkeyplaceholder5 as "leadsNotifyEsmsSecretKeyPlaceholder" };
