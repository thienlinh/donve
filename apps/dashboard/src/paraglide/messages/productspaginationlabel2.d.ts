export type LocalizedString = import("../runtime.js").LocalizedString;
export type Productspaginationlabel2Inputs = {
  page: NonNullable<unknown>;
  total: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Productspaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const productspaginationlabel2: ((
  inputs: Productspaginationlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Productspaginationlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { productspaginationlabel2 as "productsPaginationLabel" };
