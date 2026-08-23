export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productsdescriptionlabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Description" |
 *
 * @param {Productsdescriptionlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productsdescriptionlabel2: ((
  inputs?: Productsdescriptionlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productsdescriptionlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productsdescriptionlabel2 as "productsDescriptionLabel" };
