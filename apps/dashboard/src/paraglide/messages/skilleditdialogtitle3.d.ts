export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skilleditdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit skill" |
 *
 * @param {Skilleditdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skilleditdialogtitle3: ((
  inputs?: Skilleditdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skilleditdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skilleditdialogtitle3 as "skillEditDialogTitle" };
