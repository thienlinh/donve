/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimportnameplaceholder3Inputs */

const vi_landingsimportnameplaceholder3 =
  /** @type {(inputs: Landingsimportnameplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `VD: Trang khuyến mãi tháng 8`;
  };

const en_landingsimportnameplaceholder3 =
  /** @type {(inputs: Landingsimportnameplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `e.g. August promo page`;
  };

/**
 * | output |
 * | --- |
 * | "e.g. August promo page" |
 *
 * @param {Landingsimportnameplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimportnameplaceholder3 =
  /** @type {((inputs?: Landingsimportnameplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimportnameplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimportnameplaceholder3(inputs);
      return vi_landingsimportnameplaceholder3(inputs);
    }
  );
export { landingsimportnameplaceholder3 as "landingsImportNamePlaceholder" };
