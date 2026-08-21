export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsstatusactive2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Active" |
 *
 * @param {Domainsstatusactive2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsstatusactive2: ((
  inputs?: Domainsstatusactive2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsstatusactive2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsstatusactive2 as "domainsStatusActive" };
