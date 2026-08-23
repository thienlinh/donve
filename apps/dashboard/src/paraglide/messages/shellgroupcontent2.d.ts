export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellgroupcontent2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Content" |
 *
 * @param {Shellgroupcontent2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellgroupcontent2: ((
  inputs?: Shellgroupcontent2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellgroupcontent2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellgroupcontent2 as "shellGroupContent" };
