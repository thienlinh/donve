export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellleadsnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Leads" |
 *
 * @param {Shellleadsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellleadsnav2: ((
  inputs?: Shellleadsnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellleadsnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellleadsnav2 as "shellLeadsNav" };
