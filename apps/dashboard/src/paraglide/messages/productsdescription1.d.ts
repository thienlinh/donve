export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Courses, products, and services you sell through campaigns." |
 *
 * @param {Productsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsdescription1: ((
  inputs?: Productsdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsdescription1 as "productsDescription" };
