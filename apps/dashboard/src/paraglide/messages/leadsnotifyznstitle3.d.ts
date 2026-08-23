export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyznstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zalo ZNS" |
 *
 * @param {Leadsnotifyznstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyznstitle3: ((
  inputs?: Leadsnotifyznstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyznstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyznstitle3 as "leadsNotifyZnsTitle" };
