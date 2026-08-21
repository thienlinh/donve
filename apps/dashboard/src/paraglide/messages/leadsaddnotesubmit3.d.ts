export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsaddnotesubmit3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add note" |
 *
 * @param {Leadsaddnotesubmit3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsaddnotesubmit3: ((
  inputs?: Leadsaddnotesubmit3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsaddnotesubmit3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsaddnotesubmit3 as "leadsAddNoteSubmit" };
