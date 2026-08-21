/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimportdialogtitle3Inputs */

const vi_landingsimportdialogtitle3 =
  /** @type {(inputs: Landingsimportdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import landing page`;
  };

const en_landingsimportdialogtitle3 =
  /** @type {(inputs: Landingsimportdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import landing page`;
  };

/**
 * | output |
 * | --- |
 * | "Import landing page" |
 *
 * @param {Landingsimportdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimportdialogtitle3 =
  /** @type {((inputs?: Landingsimportdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimportdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimportdialogtitle3(inputs);
      return vi_landingsimportdialogtitle3(inputs);
    }
  );
export { landingsimportdialogtitle3 as "landingsImportDialogTitle" };
