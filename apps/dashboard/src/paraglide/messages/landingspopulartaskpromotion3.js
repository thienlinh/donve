/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingspopulartaskpromotion3Inputs */

const vi_landingspopulartaskpromotion3 =
  /** @type {(inputs: Landingspopulartaskpromotion3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chạy chiến dịch khuyến mãi`;
  };

const en_landingspopulartaskpromotion3 =
  /** @type {(inputs: Landingspopulartaskpromotion3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Run a promotion campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Run a promotion campaign" |
 *
 * @param {Landingspopulartaskpromotion3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingspopulartaskpromotion3 =
  /** @type {((inputs?: Landingspopulartaskpromotion3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingspopulartaskpromotion3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingspopulartaskpromotion3(inputs);
      return vi_landingspopulartaskpromotion3(inputs);
    }
  );
export { landingspopulartaskpromotion3 as "landingsPopularTaskPromotion" };
