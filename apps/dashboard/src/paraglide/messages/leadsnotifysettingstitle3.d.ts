export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifysettingstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manager alert channel" |
 *
 * @param {Leadsnotifysettingstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifysettingstitle3: ((
  inputs?: Leadsnotifysettingstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifysettingstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifysettingstitle3 as "leadsNotifySettingsTitle" };
