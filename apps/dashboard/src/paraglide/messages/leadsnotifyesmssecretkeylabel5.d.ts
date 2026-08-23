export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyesmssecretkeylabel5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Secret key" |
 *
 * @param {Leadsnotifyesmssecretkeylabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyesmssecretkeylabel5: ((
  inputs?: Leadsnotifyesmssecretkeylabel5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyesmssecretkeylabel5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyesmssecretkeylabel5 as "leadsNotifyEsmsSecretKeyLabel" };
