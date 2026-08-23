export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactioncopyphone3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Copy phone" |
 *
 * @param {Leadsactioncopyphone3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactioncopyphone3: ((
  inputs?: Leadsactioncopyphone3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactioncopyphone3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactioncopyphone3 as "leadsActionCopyPhone" };
