export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productssaveerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this product. Try again." |
 *
 * @param {Productssaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productssaveerrortoast3: ((
  inputs?: Productssaveerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productssaveerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productssaveerrortoast3 as "productsSaveErrorToast" };
