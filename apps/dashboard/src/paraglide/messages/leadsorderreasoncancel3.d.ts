export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderreasoncancel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Leadsorderreasoncancel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderreasoncancel3: ((
  inputs?: Leadsorderreasoncancel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderreasoncancel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderreasoncancel3 as "leadsOrderReasonCancel" };
