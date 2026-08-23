/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimporttabhtml3Inputs */

const vi_landingsimporttabhtml3 =
  /** @type {(inputs: Landingsimporttabhtml3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán HTML`;
  };

const en_landingsimporttabhtml3 =
  /** @type {(inputs: Landingsimporttabhtml3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste HTML`;
  };

/**
 * | output |
 * | --- |
 * | "Paste HTML" |
 *
 * @param {Landingsimporttabhtml3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimporttabhtml3 =
  /** @type {((inputs?: Landingsimporttabhtml3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimporttabhtml3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimporttabhtml3(inputs);
      return vi_landingsimporttabhtml3(inputs);
    }
  );
export { landingsimporttabhtml3 as "landingsImportTabHtml" };
