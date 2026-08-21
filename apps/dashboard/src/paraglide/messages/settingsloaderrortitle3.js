/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsloaderrortitle3Inputs */

const vi_settingsloaderrortitle3 =
  /** @type {(inputs: Settingsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được cài đặt`;
  };

const en_settingsloaderrortitle3 =
  /** @type {(inputs: Settingsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to load settings`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to load settings" |
 *
 * @param {Settingsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsloaderrortitle3 =
  /** @type {((inputs?: Settingsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsloaderrortitle3(inputs);
      return vi_settingsloaderrortitle3(inputs);
    }
  );
export { settingsloaderrortitle3 as "settingsLoadErrorTitle" };
