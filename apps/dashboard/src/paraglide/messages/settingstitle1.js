/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingstitle1Inputs */

const vi_settingstitle1 =
  /** @type {(inputs: Settingstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cài đặt`;
  };

const en_settingstitle1 =
  /** @type {(inputs: Settingstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Settings`;
  };

/**
 * | output |
 * | --- |
 * | "Settings" |
 *
 * @param {Settingstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingstitle1 =
  /** @type {((inputs?: Settingstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingstitle1(inputs);
      return vi_settingstitle1(inputs);
    }
  );
export { settingstitle1 as "settingsTitle" };
