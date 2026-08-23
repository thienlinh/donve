export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifychannelznsoption4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zalo ZNS" |
 *
 * @param {Leadsnotifychannelznsoption4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifychannelznsoption4: ((
  inputs?: Leadsnotifychannelznsoption4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifychannelznsoption4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifychannelznsoption4 as "leadsNotifyChannelZnsOption" };
