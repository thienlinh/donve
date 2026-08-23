export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsbulkdeleteconfirmdescription4Inputs = {
  count: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "This will permanently delete {count} lead(s)." |
 *
 * @param {Leadsbulkdeleteconfirmdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsbulkdeleteconfirmdescription4: ((
  inputs: Leadsbulkdeleteconfirmdescription4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsbulkdeleteconfirmdescription4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsbulkdeleteconfirmdescription4 as "leadsBulkDeleteConfirmDescription" };
