export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivitycall2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Call" |
 *
 * @param {Leadsactivitycall2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivitycall2: ((
  inputs?: Leadsactivitycall2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivitycall2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivitycall2 as "leadsActivityCall" };
