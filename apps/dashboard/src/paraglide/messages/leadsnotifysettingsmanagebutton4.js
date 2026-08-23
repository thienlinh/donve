/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifysettingsmanagebutton4Inputs */

const vi_leadsnotifysettingsmanagebutton4 =
  /** @type {(inputs: Leadsnotifysettingsmanagebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quản lý kênh thông báo`;
  };

const en_leadsnotifysettingsmanagebutton4 =
  /** @type {(inputs: Leadsnotifysettingsmanagebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manage notify channel`;
  };

/**
 * | output |
 * | --- |
 * | "Manage notify channel" |
 *
 * @param {Leadsnotifysettingsmanagebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifysettingsmanagebutton4 =
  /** @type {((inputs?: Leadsnotifysettingsmanagebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifysettingsmanagebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifysettingsmanagebutton4(inputs);
      return vi_leadsnotifysettingsmanagebutton4(inputs);
    }
  );
export { leadsnotifysettingsmanagebutton4 as "leadsNotifySettingsManageButton" };
