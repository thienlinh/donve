export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsordercancel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cancel order" |
 *
 * @param {Leadsordercancel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsordercancel2: ((
  inputs?: Leadsordercancel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsordercancel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsordercancel2 as "leadsOrderCancel" };
