/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsbrandkitdescription3Inputs */

const vi_settingsbrandkitdescription3 =
  /** @type {(inputs: Settingsbrandkitdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Màu sắc và font chữ của bạn, tự động áp dụng cho mọi landing page do AI tạo.`;
  };

const en_settingsbrandkitdescription3 =
  /** @type {(inputs: Settingsbrandkitdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Your colors and fonts, applied automatically to every AI-generated landing page.`;
  };

/**
 * | output |
 * | --- |
 * | "Your colors and fonts, applied automatically to every AI-generated landing page." |
 *
 * @param {Settingsbrandkitdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsbrandkitdescription3 =
  /** @type {((inputs?: Settingsbrandkitdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsbrandkitdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsbrandkitdescription3(inputs);
      return vi_settingsbrandkitdescription3(inputs);
    }
  );
export { settingsbrandkitdescription3 as "settingsBrandKitDescription" };
