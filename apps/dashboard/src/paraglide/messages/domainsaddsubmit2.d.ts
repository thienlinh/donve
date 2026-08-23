export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsaddsubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add domain" |
 *
 * @param {Domainsaddsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsaddsubmit2: ((
  inputs?: Domainsaddsubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsaddsubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsaddsubmit2 as "domainsAddSubmit" };
