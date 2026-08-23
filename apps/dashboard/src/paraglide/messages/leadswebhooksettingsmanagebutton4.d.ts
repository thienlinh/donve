export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooksettingsmanagebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manage webhooks" |
 *
 * @param {Leadswebhooksettingsmanagebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooksettingsmanagebutton4: ((
  inputs?: Leadswebhooksettingsmanagebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooksettingsmanagebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooksettingsmanagebutton4 as "leadsWebhookSettingsManageButton" };
