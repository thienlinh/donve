export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrreceivedatlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Received on" |
 *
 * @param {Leadsdsrreceivedatlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrreceivedatlabel4: ((
  inputs?: Leadsdsrreceivedatlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrreceivedatlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrreceivedatlabel4 as "leadsDsrReceivedAtLabel" };
