export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrsubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Log request" |
 *
 * @param {Leadsdsrsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrsubmit2: ((
  inputs?: Leadsdsrsubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrsubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrsubmit2 as "leadsDsrSubmit" };
