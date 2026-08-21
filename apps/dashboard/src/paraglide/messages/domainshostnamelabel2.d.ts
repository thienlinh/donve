export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainshostnamelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Domain" |
 *
 * @param {Domainshostnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainshostnamelabel2: ((
  inputs?: Domainshostnamelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainshostnamelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainshostnamelabel2 as "domainsHostnameLabel" };
