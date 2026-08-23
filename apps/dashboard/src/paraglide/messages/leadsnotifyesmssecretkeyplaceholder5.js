/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmssecretkeyplaceholder5Inputs */

const vi_leadsnotifyesmssecretkeyplaceholder5 =
  /** @type {(inputs: Leadsnotifyesmssecretkeyplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán secret key eSMS của bạn`;
  };

const en_leadsnotifyesmssecretkeyplaceholder5 =
  /** @type {(inputs: Leadsnotifyesmssecretkeyplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste your eSMS secret key`;
  };

/**
 * | output |
 * | --- |
 * | "Paste your eSMS secret key" |
 *
 * @param {Leadsnotifyesmssecretkeyplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmssecretkeyplaceholder5 =
  /** @type {((inputs?: Leadsnotifyesmssecretkeyplaceholder5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmssecretkeyplaceholder5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadsnotifyesmssecretkeyplaceholder5(inputs);
      return vi_leadsnotifyesmssecretkeyplaceholder5(inputs);
    }
  );
export { leadsnotifyesmssecretkeyplaceholder5 as "leadsNotifyEsmsSecretKeyPlaceholder" };
