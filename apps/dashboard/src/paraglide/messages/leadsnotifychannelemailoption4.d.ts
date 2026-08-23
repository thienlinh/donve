export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifychannelemailoption4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Email (org owner)" |
 *
 * @param {Leadsnotifychannelemailoption4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifychannelemailoption4: ((
  inputs?: Leadsnotifychannelemailoption4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifychannelemailoption4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifychannelemailoption4 as "leadsNotifyChannelEmailOption" };
