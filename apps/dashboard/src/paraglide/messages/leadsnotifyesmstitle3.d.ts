export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "SMS (eSMS.vn)" |
 *
 * @param {Leadsnotifyesmstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmstitle3: ((
  inputs?: Leadsnotifyesmstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmstitle3 as "leadsNotifyEsmsTitle" };
