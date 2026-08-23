export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifychannelsmsoption4Inputs = {};
/**
 * | output |
 * | --- |
 * | "SMS (eSMS.vn)" |
 *
 * @param {Leadsnotifychannelsmsoption4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifychannelsmsoption4: ((
  inputs?: Leadsnotifychannelsmsoption4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifychannelsmsoption4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifychannelsmsoption4 as "leadsNotifyChannelSmsOption" };
