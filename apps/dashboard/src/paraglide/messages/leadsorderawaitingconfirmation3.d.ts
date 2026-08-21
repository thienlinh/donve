export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderawaitingconfirmation3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Awaiting confirmation" |
 *
 * @param {Leadsorderawaitingconfirmation3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderawaitingconfirmation3: ((
  inputs?: Leadsorderawaitingconfirmation3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderawaitingconfirmation3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderawaitingconfirmation3 as "leadsOrderAwaitingConfirmation" };
