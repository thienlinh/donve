export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellgrouporganization2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Organization" |
 *
 * @param {Shellgrouporganization2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellgrouporganization2: ((
  inputs?: Shellgrouporganization2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellgrouporganization2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellgrouporganization2 as "shellGroupOrganization" };
