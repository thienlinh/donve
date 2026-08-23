export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Publish" |
 *
 * @param {Studiopublishdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishdialogtitle3: ((
  inputs?: Studiopublishdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishdialogtitle3 as "studioPublishDialogTitle" };
