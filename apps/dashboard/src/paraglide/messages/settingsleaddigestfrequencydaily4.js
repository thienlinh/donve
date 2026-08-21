/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsleaddigestfrequencydaily4Inputs */

const vi_settingsleaddigestfrequencydaily4 =
  /** @type {(inputs: Settingsleaddigestfrequencydaily4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cuối ngày`;
  };

const en_settingsleaddigestfrequencydaily4 =
  /** @type {(inputs: Settingsleaddigestfrequencydaily4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Once a day`;
  };

/**
 * | output |
 * | --- |
 * | "Once a day" |
 *
 * @param {Settingsleaddigestfrequencydaily4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsleaddigestfrequencydaily4 =
  /** @type {((inputs?: Settingsleaddigestfrequencydaily4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsleaddigestfrequencydaily4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsleaddigestfrequencydaily4(inputs);
      return vi_settingsleaddigestfrequencydaily4(inputs);
    }
  );
export { settingsleaddigestfrequencydaily4 as "settingsLeadDigestFrequencyDaily" };
