export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyznsdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Your own Zalo ZNS app — paste the access token you obtained via Zalo's OAuth flow, and the template ID Zalo approved. Your template must use the field names ..." |
 *
 * @param {Leadsnotifyznsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyznsdescription3: ((
  inputs?: Leadsnotifyznsdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyznsdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyznsdescription3 as "leadsNotifyZnsDescription" };
