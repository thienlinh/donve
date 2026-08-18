/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingspopulartaskproductlaunch4Inputs */

const vi_landingspopulartaskproductlaunch4 =
  /** @type {(inputs: Landingspopulartaskproductlaunch4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ra mắt sản phẩm mới`;
  };

const en_landingspopulartaskproductlaunch4 =
  /** @type {(inputs: Landingspopulartaskproductlaunch4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Launch a new product`;
  };

/**
 * | output |
 * | --- |
 * | "Launch a new product" |
 *
 * @param {Landingspopulartaskproductlaunch4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingspopulartaskproductlaunch4 =
  /** @type {((inputs?: Landingspopulartaskproductlaunch4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingspopulartaskproductlaunch4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingspopulartaskproductlaunch4(inputs);
      return vi_landingspopulartaskproductlaunch4(inputs);
    }
  );
export { landingspopulartaskproductlaunch4 as "landingsPopularTaskProductLaunch" };
