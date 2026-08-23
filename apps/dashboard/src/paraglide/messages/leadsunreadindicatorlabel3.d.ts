export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsunreadindicatorlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Unread" |
 *
 * @param {Leadsunreadindicatorlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsunreadindicatorlabel3: ((
  inputs?: Leadsunreadindicatorlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsunreadindicatorlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsunreadindicatorlabel3 as "leadsUnreadIndicatorLabel" };
