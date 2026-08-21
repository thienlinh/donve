export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Publish" |
 *
 * @param {Studiopublishbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishbutton2: ((
  inputs?: Studiopublishbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishbutton2 as "studioPublishButton" };
