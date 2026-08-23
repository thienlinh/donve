export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellgroupsales2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sales" |
 *
 * @param {Shellgroupsales2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellgroupsales2: ((
  inputs?: Shellgroupsales2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellgroupsales2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellgroupsales2 as "shellGroupSales" };
