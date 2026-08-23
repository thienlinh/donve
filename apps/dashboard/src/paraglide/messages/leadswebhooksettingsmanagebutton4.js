/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksettingsmanagebutton4Inputs */

const vi_leadswebhooksettingsmanagebutton4 =
  /** @type {(inputs: Leadswebhooksettingsmanagebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quản lý webhook`;
  };

const en_leadswebhooksettingsmanagebutton4 =
  /** @type {(inputs: Leadswebhooksettingsmanagebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manage webhooks`;
  };

/**
 * | output |
 * | --- |
 * | "Manage webhooks" |
 *
 * @param {Leadswebhooksettingsmanagebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksettingsmanagebutton4 =
  /** @type {((inputs?: Leadswebhooksettingsmanagebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksettingsmanagebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksettingsmanagebutton4(inputs);
      return vi_leadswebhooksettingsmanagebutton4(inputs);
    }
  );
export { leadswebhooksettingsmanagebutton4 as "leadsWebhookSettingsManageButton" };
