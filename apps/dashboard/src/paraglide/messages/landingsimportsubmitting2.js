/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimportsubmitting2Inputs */

const vi_landingsimportsubmitting2 =
  /** @type {(inputs: Landingsimportsubmitting2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang import…`;
  };

const en_landingsimportsubmitting2 =
  /** @type {(inputs: Landingsimportsubmitting2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Importing…`;
  };

/**
 * | output |
 * | --- |
 * | "Importing…" |
 *
 * @param {Landingsimportsubmitting2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimportsubmitting2 =
  /** @type {((inputs?: Landingsimportsubmitting2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimportsubmitting2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimportsubmitting2(inputs);
      return vi_landingsimportsubmitting2(inputs);
    }
  );
export { landingsimportsubmitting2 as "landingsImportSubmitting" };
