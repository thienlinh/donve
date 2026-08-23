export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscoursefieldstitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Course details" |
 *
 * @param {Productscoursefieldstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscoursefieldstitle3: ((
  inputs?: Productscoursefieldstitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscoursefieldstitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscoursefieldstitle3 as "productsCourseFieldsTitle" };
