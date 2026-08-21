export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrcompleteerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't mark this request handled. Try again." |
 *
 * @param {Leadsdsrcompleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrcompleteerrortoast4: ((
  inputs?: Leadsdsrcompleteerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrcompleteerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrcompleteerrortoast4 as "leadsDsrCompleteErrorToast" };
