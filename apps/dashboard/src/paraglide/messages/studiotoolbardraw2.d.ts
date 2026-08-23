export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbardraw2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Draw" |
 *
 * @param {Studiotoolbardraw2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbardraw2: ((
  inputs?: Studiotoolbardraw2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbardraw2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbardraw2 as "studioToolbarDraw" };
