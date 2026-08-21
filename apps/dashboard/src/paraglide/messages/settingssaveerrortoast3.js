/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingssaveerrortoast3Inputs */

const vi_settingssaveerrortoast3 =
  /** @type {(inputs: Settingssaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu cài đặt thất bại`;
  };

const en_settingssaveerrortoast3 =
  /** @type {(inputs: Settingssaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to save settings`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to save settings" |
 *
 * @param {Settingssaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingssaveerrortoast3 =
  /** @type {((inputs?: Settingssaveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingssaveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingssaveerrortoast3(inputs);
      return vi_settingssaveerrortoast3(inputs);
    }
  );
export { settingssaveerrortoast3 as "settingsSaveErrorToast" };
