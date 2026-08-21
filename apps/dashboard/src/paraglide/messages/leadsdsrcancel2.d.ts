export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrcancel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Leadsdsrcancel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrcancel2: ((
  inputs?: Leadsdsrcancel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrcancel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrcancel2 as "leadsDsrCancel" };
