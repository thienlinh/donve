/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsactionviewlive3Inputs */

const vi_landingsactionviewlive3 =
  /** @type {(inputs: Landingsactionviewlive3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem live`;
  };

const en_landingsactionviewlive3 =
  /** @type {(inputs: Landingsactionviewlive3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `View live`;
  };

/**
 * | output |
 * | --- |
 * | "View live" |
 *
 * @param {Landingsactionviewlive3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsactionviewlive3 =
  /** @type {((inputs?: Landingsactionviewlive3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsactionviewlive3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsactionviewlive3(inputs);
      return vi_landingsactionviewlive3(inputs);
    }
  );
export { landingsactionviewlive3 as "landingsActionViewLive" };
