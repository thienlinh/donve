export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiounpublishsuccesstoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Unpublished" |
 *
 * @param {Studiounpublishsuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiounpublishsuccesstoast3: ((
  inputs?: Studiounpublishsuccesstoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiounpublishsuccesstoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiounpublishsuccesstoast3 as "studioUnpublishSuccessToast" };
