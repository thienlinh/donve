/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingspopulartaskportfolio3Inputs */

const vi_landingspopulartaskportfolio3 =
  /** @type {(inputs: Landingspopulartaskportfolio3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giới thiệu portfolio`;
  };

const en_landingspopulartaskportfolio3 =
  /** @type {(inputs: Landingspopulartaskportfolio3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Showcase a portfolio`;
  };

/**
 * | output |
 * | --- |
 * | "Showcase a portfolio" |
 *
 * @param {Landingspopulartaskportfolio3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingspopulartaskportfolio3 =
  /** @type {((inputs?: Landingspopulartaskportfolio3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingspopulartaskportfolio3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingspopulartaskportfolio3(inputs);
      return vi_landingspopulartaskportfolio3(inputs);
    }
  );
export { landingspopulartaskportfolio3 as "landingsPopularTaskPortfolio" };
