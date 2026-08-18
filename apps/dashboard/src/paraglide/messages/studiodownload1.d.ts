export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodownload1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Download" |
 *
 * @param {Studiodownload1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodownload1: ((
  inputs?: Studiodownload1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodownload1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodownload1 as "studioDownload" };
