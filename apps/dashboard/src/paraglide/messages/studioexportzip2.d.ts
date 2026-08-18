export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioexportzip2Inputs = {};
/**
 * | output |
 * | --- |
 * | "ZIP" |
 *
 * @param {Studioexportzip2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioexportzip2: ((
  inputs?: Studioexportzip2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioexportzip2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioexportzip2 as "studioExportZip" };
