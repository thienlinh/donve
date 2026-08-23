export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadswebhooktiktokreconnectbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reconnect" |
 *
 * @param {Leadswebhooktiktokreconnectbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadswebhooktiktokreconnectbutton4: ((
  inputs?: Leadswebhooktiktokreconnectbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadswebhooktiktokreconnectbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadswebhooktiktokreconnectbutton4 as "leadsWebhookTiktokReconnectButton" };
