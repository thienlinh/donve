/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmsbrandnameplaceholder4Inputs */

const vi_leadsnotifyesmsbrandnameplaceholder4 =
  /** @type {(inputs: Leadsnotifyesmsbrandnameplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên thương hiệu SMS đã đăng ký`;
  };

const en_leadsnotifyesmsbrandnameplaceholder4 =
  /** @type {(inputs: Leadsnotifyesmsbrandnameplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Your approved SMS sender name`;
  };

/**
 * | output |
 * | --- |
 * | "Your approved SMS sender name" |
 *
 * @param {Leadsnotifyesmsbrandnameplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmsbrandnameplaceholder4 =
  /** @type {((inputs?: Leadsnotifyesmsbrandnameplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmsbrandnameplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadsnotifyesmsbrandnameplaceholder4(inputs);
      return vi_leadsnotifyesmsbrandnameplaceholder4(inputs);
    }
  );
export { leadsnotifyesmsbrandnameplaceholder4 as "leadsNotifyEsmsBrandnamePlaceholder" };
