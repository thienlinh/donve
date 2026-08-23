export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifychannellabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Channel" |
 *
 * @param {Leadsnotifychannellabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifychannellabel3: ((
  inputs?: Leadsnotifychannellabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifychannellabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifychannellabel3 as "leadsNotifyChannelLabel" };
