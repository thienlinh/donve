export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportskippedrowstoast4Inputs = {
  count: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Skipped {count} row(s) missing a name or phone" |
 *
 * @param {Leadsimportskippedrowstoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportskippedrowstoast4: ((
  inputs: Leadsimportskippedrowstoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportskippedrowstoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportskippedrowstoast4 as "leadsImportSkippedRowsToast" };
