/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmsdescription3Inputs */

const vi_leadsnotifyesmsdescription3 =
  /** @type {(inputs: Leadsnotifyesmsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tài khoản eSMS.vn của riêng bạn — dán API key và secret key từ dashboard eSMS.`;
  };

const en_leadsnotifyesmsdescription3 =
  /** @type {(inputs: Leadsnotifyesmsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Your own eSMS.vn account — paste the API key and secret key from your eSMS dashboard.`;
  };

/**
 * | output |
 * | --- |
 * | "Your own eSMS.vn account — paste the API key and secret key from your eSMS dashboard." |
 *
 * @param {Leadsnotifyesmsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmsdescription3 =
  /** @type {((inputs?: Leadsnotifyesmsdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmsdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyesmsdescription3(inputs);
      return vi_leadsnotifyesmsdescription3(inputs);
    }
  );
export { leadsnotifyesmsdescription3 as "leadsNotifyEsmsDescription" };
