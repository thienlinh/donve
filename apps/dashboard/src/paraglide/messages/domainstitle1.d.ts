export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Custom domains" |
 *
 * @param {Domainstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainstitle1: ((
  inputs?: Domainstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainstitle1 as "domainsTitle" };
