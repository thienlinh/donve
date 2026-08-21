export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productstypecourse2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Course" |
 *
 * @param {Productstypecourse2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productstypecourse2: ((
  inputs?: Productstypecourse2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productstypecourse2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productstypecourse2 as "productsTypeCourse" };
