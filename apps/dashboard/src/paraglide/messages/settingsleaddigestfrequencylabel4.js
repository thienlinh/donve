/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsleaddigestfrequencylabel4Inputs */

const vi_settingsleaddigestfrequencylabel4 =
  /** @type {(inputs: Settingsleaddigestfrequencylabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Digest lead mới`;
  };

const en_settingsleaddigestfrequencylabel4 =
  /** @type {(inputs: Settingsleaddigestfrequencylabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `New lead digest`;
  };

/**
 * | output |
 * | --- |
 * | "New lead digest" |
 *
 * @param {Settingsleaddigestfrequencylabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsleaddigestfrequencylabel4 =
  /** @type {((inputs?: Settingsleaddigestfrequencylabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsleaddigestfrequencylabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsleaddigestfrequencylabel4(inputs);
      return vi_settingsleaddigestfrequencylabel4(inputs);
    }
  );
export { settingsleaddigestfrequencylabel4 as "settingsLeadDigestFrequencyLabel" };
