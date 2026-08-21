/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimportnamelabel3Inputs */

const vi_landingsimportnamelabel3 =
  /** @type {(inputs: Landingsimportnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên landing (tuỳ chọn)`;
  };

const en_landingsimportnamelabel3 =
  /** @type {(inputs: Landingsimportnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name (optional)`;
  };

/**
 * | output |
 * | --- |
 * | "Name (optional)" |
 *
 * @param {Landingsimportnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimportnamelabel3 =
  /** @type {((inputs?: Landingsimportnamelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimportnamelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimportnamelabel3(inputs);
      return vi_landingsimportnamelabel3(inputs);
    }
  );
export { landingsimportnamelabel3 as "landingsImportNameLabel" };
