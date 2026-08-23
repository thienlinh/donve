export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeleteerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't delete the page. Try again." |
 *
 * @param {Studiodeleteerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeleteerrortoast3: ((
  inputs?: Studiodeleteerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeleteerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeleteerrortoast3 as "studioDeleteErrorToast" };
