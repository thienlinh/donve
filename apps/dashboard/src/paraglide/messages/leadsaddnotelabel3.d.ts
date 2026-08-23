export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsaddnotelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add a note" |
 *
 * @param {Leadsaddnotelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsaddnotelabel3: ((
  inputs?: Leadsaddnotelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsaddnotelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsaddnotelabel3 as "leadsAddNoteLabel" };
