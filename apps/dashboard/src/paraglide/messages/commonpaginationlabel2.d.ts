export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonpaginationlabel2Inputs = {
  page: NonNullable<unknown>;
  total: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Commonpaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonpaginationlabel2: ((
  inputs: Commonpaginationlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonpaginationlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonpaginationlabel2 as "commonPaginationLabel" };
