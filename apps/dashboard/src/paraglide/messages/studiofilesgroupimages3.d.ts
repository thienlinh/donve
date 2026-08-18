export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesgroupimages3Inputs = {};
/**
 * | output |
 * | --- |
 * | "IMAGES" |
 *
 * @param {Studiofilesgroupimages3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesgroupimages3: ((
  inputs?: Studiofilesgroupimages3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesgroupimages3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesgroupimages3 as "studioFilesGroupImages" };
