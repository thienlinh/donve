export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivitysystem2Inputs = {};
/**
 * | output |
 * | --- |
 * | "System update" |
 *
 * @param {Leadsactivitysystem2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivitysystem2: ((
  inputs?: Leadsactivitysystem2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivitysystem2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivitysystem2 as "leadsActivitySystem" };
