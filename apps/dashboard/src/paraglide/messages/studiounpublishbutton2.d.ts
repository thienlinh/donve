export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiounpublishbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Unpublish" |
 *
 * @param {Studiounpublishbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiounpublishbutton2: ((
  inputs?: Studiounpublishbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiounpublishbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiounpublishbutton2 as "studioUnpublishButton" };
