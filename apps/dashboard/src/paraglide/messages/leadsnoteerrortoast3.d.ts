export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnoteerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this note. Try again." |
 *
 * @param {Leadsnoteerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnoteerrortoast3: ((
  inputs?: Leadsnoteerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnoteerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnoteerrortoast3 as "leadsNoteErrorToast" };
