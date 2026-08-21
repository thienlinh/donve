export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscoursestartsatlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Start date" |
 *
 * @param {Productscoursestartsatlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscoursestartsatlabel4: ((
  inputs?: Productscoursestartsatlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscoursestartsatlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscoursestartsatlabel4 as "productsCourseStartsAtLabel" };
