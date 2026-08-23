/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmsapikeyplaceholder5Inputs */

const vi_leadsnotifyesmsapikeyplaceholder5 =
  /** @type {(inputs: Leadsnotifyesmsapikeyplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán API key eSMS của bạn`;
  };

const en_leadsnotifyesmsapikeyplaceholder5 =
  /** @type {(inputs: Leadsnotifyesmsapikeyplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste your eSMS API key`;
  };

/**
 * | output |
 * | --- |
 * | "Paste your eSMS API key" |
 *
 * @param {Leadsnotifyesmsapikeyplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmsapikeyplaceholder5 =
  /** @type {((inputs?: Leadsnotifyesmsapikeyplaceholder5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmsapikeyplaceholder5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyesmsapikeyplaceholder5(inputs);
      return vi_leadsnotifyesmsapikeyplaceholder5(inputs);
    }
  );
export { leadsnotifyesmsapikeyplaceholder5 as "leadsNotifyEsmsApiKeyPlaceholder" };
