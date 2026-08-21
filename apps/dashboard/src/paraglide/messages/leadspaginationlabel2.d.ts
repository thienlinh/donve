export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadspaginationlabel2Inputs = {
  page: NonNullable<unknown>;
  total: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Leadspaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadspaginationlabel2: ((
  inputs: Leadspaginationlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadspaginationlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadspaginationlabel2 as "leadsPaginationLabel" };
