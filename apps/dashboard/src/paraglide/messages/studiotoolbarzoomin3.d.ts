export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbarzoomin3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zoom in" |
 *
 * @param {Studiotoolbarzoomin3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbarzoomin3: ((
  inputs?: Studiotoolbarzoomin3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbarzoomin3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbarzoomin3 as "studioToolbarZoomIn" };
