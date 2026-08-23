/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimporttabfile3Inputs */

const vi_landingsimporttabfile3 =
  /** @type {(inputs: Landingsimporttabfile3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải file lên`;
  };

const en_landingsimporttabfile3 =
  /** @type {(inputs: Landingsimporttabfile3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Upload file`;
  };

/**
 * | output |
 * | --- |
 * | "Upload file" |
 *
 * @param {Landingsimporttabfile3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimporttabfile3 =
  /** @type {((inputs?: Landingsimporttabfile3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimporttabfile3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimporttabfile3(inputs);
      return vi_landingsimporttabfile3(inputs);
    }
  );
export { landingsimporttabfile3 as "landingsImportTabFile" };
