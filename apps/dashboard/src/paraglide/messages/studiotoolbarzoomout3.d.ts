export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbarzoomout3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zoom out" |
 *
 * @param {Studiotoolbarzoomout3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbarzoomout3: ((
  inputs?: Studiotoolbarzoomout3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbarzoomout3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbarzoomout3 as "studioToolbarZoomOut" };
