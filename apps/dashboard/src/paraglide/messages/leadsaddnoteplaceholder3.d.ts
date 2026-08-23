export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsaddnoteplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Write a note about this lead..." |
 *
 * @param {Leadsaddnoteplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsaddnoteplaceholder3: ((
  inputs?: Leadsaddnoteplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsaddnoteplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsaddnoteplaceholder3 as "leadsAddNotePlaceholder" };
