export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkdeleteconfirm3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Leadsbulkdeleteconfirm3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkdeleteconfirm3: ((
  inputs?: Leadsbulkdeleteconfirm3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkdeleteconfirm3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkdeleteconfirm3 as "leadsBulkDeleteConfirm" };
