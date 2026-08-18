export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioexportpng2Inputs = {};
/**
 * | output |
 * | --- |
 * | "PNG" |
 *
 * @param {Studioexportpng2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioexportpng2: ((
  inputs?: Studioexportpng2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioexportpng2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioexportpng2 as "studioExportPng" };
