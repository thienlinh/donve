export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactioncall2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Call" |
 *
 * @param {Leadsactioncall2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactioncall2: ((
  inputs?: Leadsactioncall2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactioncall2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactioncall2 as "leadsActionCall" };
