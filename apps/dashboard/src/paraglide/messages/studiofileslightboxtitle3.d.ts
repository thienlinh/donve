export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofileslightboxtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Thumbnail preview" |
 *
 * @param {Studiofileslightboxtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofileslightboxtitle3: ((
  inputs?: Studiofileslightboxtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofileslightboxtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofileslightboxtitle3 as "studioFilesLightboxTitle" };
