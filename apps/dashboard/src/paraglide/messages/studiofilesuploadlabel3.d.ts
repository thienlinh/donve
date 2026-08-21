export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesuploadlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Upload image or video" |
 *
 * @param {Studiofilesuploadlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesuploadlabel3: ((
  inputs?: Studiofilesuploadlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesuploadlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesuploadlabel3 as "studioFilesUploadLabel" };
