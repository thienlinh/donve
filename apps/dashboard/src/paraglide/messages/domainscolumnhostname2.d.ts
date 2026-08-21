export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainscolumnhostname2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Domain" |
 *
 * @param {Domainscolumnhostname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainscolumnhostname2: ((
  inputs?: Domainscolumnhostname2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainscolumnhostname2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainscolumnhostname2 as "domainsColumnHostname" };
