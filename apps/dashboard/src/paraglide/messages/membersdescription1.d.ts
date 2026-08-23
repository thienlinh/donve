export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "People with access to this organization." |
 *
 * @param {Membersdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersdescription1: ((
  inputs?: Membersdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersdescription1 as "membersDescription" };
