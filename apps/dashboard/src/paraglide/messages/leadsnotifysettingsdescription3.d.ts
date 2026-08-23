export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifysettingsdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pick which channel notify_manager (SLA-breach alerts) pushes to. Email needs no setup; Zalo ZNS/SMS need your own provider credentials below." |
 *
 * @param {Leadsnotifysettingsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifysettingsdescription3: ((
  inputs?: Leadsnotifysettingsdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifysettingsdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifysettingsdescription3 as "leadsNotifySettingsDescription" };
