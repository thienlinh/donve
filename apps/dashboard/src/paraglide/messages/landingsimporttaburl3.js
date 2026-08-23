/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimporttaburl3Inputs */

const vi_landingsimporttaburl3 =
  /** @type {(inputs: Landingsimporttaburl3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán link`;
  };

const en_landingsimporttaburl3 =
  /** @type {(inputs: Landingsimporttaburl3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste link`;
  };

/**
 * | output |
 * | --- |
 * | "Paste link" |
 *
 * @param {Landingsimporttaburl3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimporttaburl3 =
  /** @type {((inputs?: Landingsimporttaburl3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimporttaburl3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimporttaburl3(inputs);
      return vi_landingsimporttaburl3(inputs);
    }
  );
export { landingsimporttaburl3 as "landingsImportTabUrl" };
