export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkdeleteconfirmtitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete selected leads?" |
 *
 * @param {Leadsbulkdeleteconfirmtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkdeleteconfirmtitle4: ((
  inputs?: Leadsbulkdeleteconfirmtitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkdeleteconfirmtitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkdeleteconfirmtitle4 as "leadsBulkDeleteConfirmTitle" };
