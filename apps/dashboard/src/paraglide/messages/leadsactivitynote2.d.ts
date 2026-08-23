export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivitynote2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Note" |
 *
 * @param {Leadsactivitynote2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivitynote2: ((
  inputs?: Leadsactivitynote2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivitynote2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivitynote2 as "leadsActivityNote" };
