export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shelldomainsnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Domains" |
 *
 * @param {Shelldomainsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shelldomainsnav2: ((
  inputs?: Shelldomainsnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shelldomainsnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shelldomainsnav2 as "shellDomainsNav" };
