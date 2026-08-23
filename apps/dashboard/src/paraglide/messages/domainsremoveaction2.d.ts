export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsremoveaction2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove domain" |
 *
 * @param {Domainsremoveaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsremoveaction2: ((
  inputs?: Domainsremoveaction2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsremoveaction2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsremoveaction2 as "domainsRemoveAction" };
