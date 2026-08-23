export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbarcomment2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Comment" |
 *
 * @param {Studiotoolbarcomment2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbarcomment2: ((
  inputs?: Studiotoolbarcomment2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbarcomment2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbarcomment2 as "studioToolbarComment" };
