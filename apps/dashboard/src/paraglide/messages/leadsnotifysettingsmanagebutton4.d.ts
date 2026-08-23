export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifysettingsmanagebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manage notify channel" |
 *
 * @param {Leadsnotifysettingsmanagebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifysettingsmanagebutton4: ((
  inputs?: Leadsnotifysettingsmanagebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifysettingsmanagebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifysettingsmanagebutton4 as "leadsNotifySettingsManageButton" };
