export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsimportsuccesstoast3Inputs = {
  created: NonNullable<unknown>;
  merged: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Imported {created} new lead(s), merged {merged} into existing leads" |
 *
 * @param {Leadsimportsuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsimportsuccesstoast3: ((
  inputs: Leadsimportsuccesstoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsimportsuccesstoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsimportsuccesstoast3 as "leadsImportSuccessToast" };
