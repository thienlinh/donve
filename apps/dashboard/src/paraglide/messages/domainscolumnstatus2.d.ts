export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainscolumnstatus2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Domainscolumnstatus2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainscolumnstatus2: ((
  inputs?: Domainscolumnstatus2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainscolumnstatus2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainscolumnstatus2 as "domainsColumnStatus" };
