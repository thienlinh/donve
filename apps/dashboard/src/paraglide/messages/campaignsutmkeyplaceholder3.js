/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsutmkeyplaceholder3Inputs */

const vi_campaignsutmkeyplaceholder3 =
  /** @type {(inputs: Campaignsutmkeyplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tham số (vd: utm_source)`;
  };

const en_campaignsutmkeyplaceholder3 =
  /** @type {(inputs: Campaignsutmkeyplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Parameter (e.g. utm_source)`;
  };

/**
 * | output |
 * | --- |
 * | "Parameter (e.g. utm_source)" |
 *
 * @param {Campaignsutmkeyplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsutmkeyplaceholder3 =
  /** @type {((inputs?: Campaignsutmkeyplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsutmkeyplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsutmkeyplaceholder3(inputs);
      return vi_campaignsutmkeyplaceholder3(inputs);
    }
  );
export { campaignsutmkeyplaceholder3 as "campaignsUtmKeyPlaceholder" };
