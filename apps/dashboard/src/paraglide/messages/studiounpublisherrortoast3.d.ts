export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiounpublisherrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't unpublish. Try again." |
 *
 * @param {Studiounpublisherrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiounpublisherrortoast3: ((
  inputs?: Studiounpublisherrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiounpublisherrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiounpublisherrortoast3 as "studioUnpublishErrorToast" };
