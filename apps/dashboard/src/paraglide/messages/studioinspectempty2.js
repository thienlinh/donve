/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioinspectempty2Inputs */

const vi_studioinspectempty2 =
  /** @type {(inputs: Studioinspectempty2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn một phần tử ở chế độ Edit để chỉnh sửa style.`;
  };

const en_studioinspectempty2 =
  /** @type {(inputs: Studioinspectempty2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Select an element in Edit mode to inspect its style.`;
  };

/**
 * | output |
 * | --- |
 * | "Select an element in Edit mode to inspect its style." |
 *
 * @param {Studioinspectempty2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioinspectempty2 =
  /** @type {((inputs?: Studioinspectempty2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioinspectempty2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioinspectempty2(inputs);
      return vi_studioinspectempty2(inputs);
    }
  );
export { studioinspectempty2 as "studioInspectEmpty" };
