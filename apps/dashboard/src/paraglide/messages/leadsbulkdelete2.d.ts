export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkdelete2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Leadsbulkdelete2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkdelete2: ((
  inputs?: Leadsbulkdelete2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkdelete2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkdelete2 as "leadsBulkDelete" };
