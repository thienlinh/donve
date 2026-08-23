/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsforbiddentitle2Inputs */

const vi_settingsforbiddentitle2 =
  /** @type {(inputs: Settingsforbiddentitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chỉ owner/admin mới xem được cài đặt tổ chức`;
  };

const en_settingsforbiddentitle2 =
  /** @type {(inputs: Settingsforbiddentitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Only owners/admins can view organization settings`;
  };

/**
 * | output |
 * | --- |
 * | "Only owners/admins can view organization settings" |
 *
 * @param {Settingsforbiddentitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsforbiddentitle2 =
  /** @type {((inputs?: Settingsforbiddentitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsforbiddentitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsforbiddentitle2(inputs);
      return vi_settingsforbiddentitle2(inputs);
    }
  );
export { settingsforbiddentitle2 as "settingsForbiddenTitle" };
