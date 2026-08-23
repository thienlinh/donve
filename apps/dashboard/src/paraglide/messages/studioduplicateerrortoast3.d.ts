export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioduplicateerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't duplicate the page. Try again." |
 *
 * @param {Studioduplicateerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioduplicateerrortoast3: ((
  inputs?: Studioduplicateerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioduplicateerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioduplicateerrortoast3 as "studioDuplicateErrorToast" };
