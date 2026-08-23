export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingscreateerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't create the landing page. Try again." |
 *
 * @param {Landingscreateerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingscreateerrortoast3: ((
  inputs?: Landingscreateerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingscreateerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingscreateerrortoast3 as "landingsCreateErrorToast" };
