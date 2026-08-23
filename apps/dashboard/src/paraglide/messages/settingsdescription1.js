/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsdescription1Inputs */

const vi_settingsdescription1 =
  /** @type {(inputs: Settingsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tùy chọn áp dụng cho toàn tổ chức.`;
  };

const en_settingsdescription1 =
  /** @type {(inputs: Settingsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Organization-wide preferences.`;
  };

/**
 * | output |
 * | --- |
 * | "Organization-wide preferences." |
 *
 * @param {Settingsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsdescription1 =
  /** @type {((inputs?: Settingsdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsdescription1(inputs);
      return vi_settingsdescription1(inputs);
    }
  );
export { settingsdescription1 as "settingsDescription" };
