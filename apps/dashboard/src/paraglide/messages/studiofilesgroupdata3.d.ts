export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesgroupdata3Inputs = {};
/**
 * | output |
 * | --- |
 * | "DATA" |
 *
 * @param {Studiofilesgroupdata3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesgroupdata3: ((
  inputs?: Studiofilesgroupdata3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesgroupdata3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesgroupdata3 as "studioFilesGroupData" };
