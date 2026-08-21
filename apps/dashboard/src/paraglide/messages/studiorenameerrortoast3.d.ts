export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiorenameerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't rename the page. Try again." |
 *
 * @param {Studiorenameerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiorenameerrortoast3: ((
  inputs?: Studiorenameerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiorenameerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiorenameerrortoast3 as "studioRenameErrorToast" };
