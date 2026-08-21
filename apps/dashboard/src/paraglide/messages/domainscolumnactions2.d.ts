export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainscolumnactions2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Domainscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainscolumnactions2: ((
  inputs?: Domainscolumnactions2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainscolumnactions2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainscolumnactions2 as "domainsColumnActions" };
