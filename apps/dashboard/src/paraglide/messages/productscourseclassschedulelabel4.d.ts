export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscourseclassschedulelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Class schedule" |
 *
 * @param {Productscourseclassschedulelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscourseclassschedulelabel4: ((
  inputs?: Productscourseclassschedulelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscourseclassschedulelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscourseclassschedulelabel4 as "productsCourseClassScheduleLabel" };
