export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesgroupfolders3Inputs = {};
/**
 * | output |
 * | --- |
 * | "FOLDERS" |
 *
 * @param {Studiofilesgroupfolders3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesgroupfolders3: ((
  inputs?: Studiofilesgroupfolders3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesgroupfolders3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesgroupfolders3 as "studioFilesGroupFolders" };
