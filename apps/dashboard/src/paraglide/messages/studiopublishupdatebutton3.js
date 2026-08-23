/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishupdatebutton3Inputs */

const vi_studiopublishupdatebutton3 =
  /** @type {(inputs: Studiopublishupdatebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất bản bản cập nhật`;
  };

const en_studiopublishupdatebutton3 =
  /** @type {(inputs: Studiopublishupdatebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Publish update`;
  };

/**
 * | output |
 * | --- |
 * | "Publish update" |
 *
 * @param {Studiopublishupdatebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishupdatebutton3 =
  /** @type {((inputs?: Studiopublishupdatebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishupdatebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishupdatebutton3(inputs);
      return vi_studiopublishupdatebutton3(inputs);
    }
  );
export { studiopublishupdatebutton3 as "studioPublishUpdateButton" };
