export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionlabelplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add a label…" |
 *
 * @param {Studioversionlabelplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionlabelplaceholder3: ((
  inputs?: Studioversionlabelplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionlabelplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionlabelplaceholder3 as "studioVersionLabelPlaceholder" };
