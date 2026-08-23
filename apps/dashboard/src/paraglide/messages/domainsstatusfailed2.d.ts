export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsstatusfailed2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed" |
 *
 * @param {Domainsstatusfailed2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsstatusfailed2: ((
  inputs?: Domainsstatusfailed2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsstatusfailed2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsstatusfailed2 as "domainsStatusFailed" };
