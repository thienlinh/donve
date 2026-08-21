export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productssavesubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Productssavesubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productssavesubmit2: ((
  inputs?: Productssavesubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productssavesubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productssavesubmit2 as "productsSaveSubmit" };
