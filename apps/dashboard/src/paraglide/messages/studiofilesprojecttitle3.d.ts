export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesprojecttitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Project" |
 *
 * @param {Studiofilesprojecttitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesprojecttitle3: ((
  inputs?: Studiofilesprojecttitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesprojecttitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesprojecttitle3 as "studioFilesProjectTitle" };
