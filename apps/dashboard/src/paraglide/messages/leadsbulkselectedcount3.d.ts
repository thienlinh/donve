export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkselectedcount3Inputs = {
  count: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{count} lead(s) selected" |
 *
 * @param {Leadsbulkselectedcount3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkselectedcount3: ((
  inputs: Leadsbulkselectedcount3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkselectedcount3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkselectedcount3 as "leadsBulkSelectedCount" };
