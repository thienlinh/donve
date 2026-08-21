export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotificationsbelllabel3Inputs = {
  count: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Lead notifications ({count} unread)" |
 *
 * @param {Leadsnotificationsbelllabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotificationsbelllabel3: ((
  inputs: Leadsnotificationsbelllabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotificationsbelllabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotificationsbelllabel3 as "leadsNotificationsBellLabel" };
