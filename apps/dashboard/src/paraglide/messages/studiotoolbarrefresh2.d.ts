export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbarrefresh2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Refresh canvas" |
 *
 * @param {Studiotoolbarrefresh2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbarrefresh2: ((
  inputs?: Studiotoolbarrefresh2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbarrefresh2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbarrefresh2 as "studioToolbarRefresh" };
