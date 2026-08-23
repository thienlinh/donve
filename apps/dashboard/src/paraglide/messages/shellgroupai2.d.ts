export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellgroupai2Inputs = {};
/**
 * | output |
 * | --- |
 * | "AI" |
 *
 * @param {Shellgroupai2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellgroupai2: ((
  inputs?: Shellgroupai2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellgroupai2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellgroupai2 as "shellGroupAi" };
