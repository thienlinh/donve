export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productscourseactivationlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Activation instructions" |
 *
 * @param {Productscourseactivationlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productscourseactivationlabel3: ((
  inputs?: Productscourseactivationlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productscourseactivationlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productscourseactivationlabel3 as "productsCourseActivationLabel" };
