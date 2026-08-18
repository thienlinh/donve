export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesuploadfailed3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Upload failed. Try a smaller image." |
 *
 * @param {Studiofilesuploadfailed3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesuploadfailed3: ((
  inputs?: Studiofilesuploadfailed3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesuploadfailed3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesuploadfailed3 as "studioFilesUploadFailed" };
