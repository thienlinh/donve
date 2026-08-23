export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesgrouppages3Inputs = {};
/**
 * | output |
 * | --- |
 * | "PAGES" |
 *
 * @param {Studiofilesgrouppages3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesgrouppages3: ((
  inputs?: Studiofilesgrouppages3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesgrouppages3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesgrouppages3 as "studioFilesGroupPages" };
