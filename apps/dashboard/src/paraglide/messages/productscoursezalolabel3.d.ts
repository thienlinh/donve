export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscoursezalolabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zalo group link" |
 *
 * @param {Productscoursezalolabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscoursezalolabel3: ((
  inputs?: Productscoursezalolabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscoursezalolabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscoursezalolabel3 as "productsCourseZaloLabel" };
