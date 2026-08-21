export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactivityresubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Resubmitted" |
 *
 * @param {Leadsactivityresubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactivityresubmit2: ((
  inputs?: Leadsactivityresubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactivityresubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactivityresubmit2 as "leadsActivityResubmit" };
