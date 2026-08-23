/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversioncomparehint3Inputs */

const vi_studioversioncomparehint3 =
  /** @type {(inputs: Studioversioncomparehint3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn đúng 2 phiên bản để so sánh`;
  };

const en_studioversioncomparehint3 =
  /** @type {(inputs: Studioversioncomparehint3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Select exactly 2 versions to compare`;
  };

/**
 * | output |
 * | --- |
 * | "Select exactly 2 versions to compare" |
 *
 * @param {Studioversioncomparehint3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversioncomparehint3 =
  /** @type {((inputs?: Studioversioncomparehint3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversioncomparehint3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversioncomparehint3(inputs);
      return vi_studioversioncomparehint3(inputs);
    }
  );
export { studioversioncomparehint3 as "studioVersionCompareHint" };
