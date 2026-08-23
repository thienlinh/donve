export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyznsaccesstokenplaceholder5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste your Zalo ZNS access token" |
 *
 * @param {Leadsnotifyznsaccesstokenplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyznsaccesstokenplaceholder5: ((
  inputs?: Leadsnotifyznsaccesstokenplaceholder5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyznsaccesstokenplaceholder5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyznsaccesstokenplaceholder5 as "leadsNotifyZnsAccessTokenPlaceholder" };
