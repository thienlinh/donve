/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Apptagline1Inputs */

const vi_apptagline1 =
  /** @type {(inputs: Apptagline1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối đơn hàng - Vận đơn dễ dàng`;
  };

const en_apptagline1 =
  /** @type {(inputs: Apptagline1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect orders, ship with ease`;
  };

/**
 * | output |
 * | --- |
 * | "Connect orders, ship with ease" |
 *
 * @param {Apptagline1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const apptagline1 =
  /** @type {((inputs?: Apptagline1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Apptagline1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_apptagline1(inputs);
      return vi_apptagline1(inputs);
    }
  );
export { apptagline1 as "appTagline" };
