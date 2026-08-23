/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsactionduplicate2Inputs */

const vi_landingsactionduplicate2 =
  /** @type {(inputs: Landingsactionduplicate2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhân bản`;
  };

const en_landingsactionduplicate2 =
  /** @type {(inputs: Landingsactionduplicate2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Duplicate`;
  };

/**
 * | output |
 * | --- |
 * | "Duplicate" |
 *
 * @param {Landingsactionduplicate2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsactionduplicate2 =
  /** @type {((inputs?: Landingsactionduplicate2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsactionduplicate2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsactionduplicate2(inputs);
      return vi_landingsactionduplicate2(inputs);
    }
  );
export { landingsactionduplicate2 as "landingsActionDuplicate" };
