export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssubnavnotifications3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Notifications" |
 *
 * @param {Leadssubnavnotifications3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssubnavnotifications3: ((
  inputs?: Leadssubnavnotifications3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssubnavnotifications3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssubnavnotifications3 as "leadsSubNavNotifications" };
