export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversiondifftitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Compare versions" |
 *
 * @param {Studioversiondifftitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversiondifftitle3: ((
  inputs?: Studioversiondifftitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversiondifftitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversiondifftitle3 as "studioVersionDiffTitle" };
