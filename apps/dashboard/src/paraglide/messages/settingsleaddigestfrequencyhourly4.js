/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsleaddigestfrequencyhourly4Inputs */

const vi_settingsleaddigestfrequencyhourly4 =
  /** @type {(inputs: Settingsleaddigestfrequencyhourly4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mỗi giờ`;
  };

const en_settingsleaddigestfrequencyhourly4 =
  /** @type {(inputs: Settingsleaddigestfrequencyhourly4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Every hour`;
  };

/**
 * | output |
 * | --- |
 * | "Every hour" |
 *
 * @param {Settingsleaddigestfrequencyhourly4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsleaddigestfrequencyhourly4 =
  /** @type {((inputs?: Settingsleaddigestfrequencyhourly4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsleaddigestfrequencyhourly4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsleaddigestfrequencyhourly4(inputs);
      return vi_settingsleaddigestfrequencyhourly4(inputs);
    }
  );
export { settingsleaddigestfrequencyhourly4 as "settingsLeadDigestFrequencyHourly" };
