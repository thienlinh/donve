/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishdialogdescription3Inputs */

const vi_studiopublishdialogdescription3 =
  /** @type {(inputs: Studiopublishdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rollback và gỡ xuất bản có hiệu lực ngay lập tức — không cần purge cache riêng.`;
  };

const en_studiopublishdialogdescription3 =
  /** @type {(inputs: Studiopublishdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rollback and unpublish take effect immediately — no separate cache purge needed.`;
  };

/**
 * | output |
 * | --- |
 * | "Rollback and unpublish take effect immediately — no separate cache purge needed." |
 *
 * @param {Studiopublishdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishdialogdescription3 =
  /** @type {((inputs?: Studiopublishdialogdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishdialogdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishdialogdescription3(inputs);
      return vi_studiopublishdialogdescription3(inputs);
    }
  );
export { studiopublishdialogdescription3 as "studioPublishDialogDescription" };
