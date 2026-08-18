/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsnodesignsystem3Inputs */

const vi_landingsnodesignsystem3 =
  /** @type {(inputs: Landingsnodesignsystem3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không dùng design system`;
  };

const en_landingsnodesignsystem3 =
  /** @type {(inputs: Landingsnodesignsystem3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No design system`;
  };

/**
 * | output |
 * | --- |
 * | "No design system" |
 *
 * @param {Landingsnodesignsystem3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsnodesignsystem3 =
  /** @type {((inputs?: Landingsnodesignsystem3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsnodesignsystem3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsnodesignsystem3(inputs);
      return vi_landingsnodesignsystem3(inputs);
    }
  );
export { landingsnodesignsystem3 as "landingsNoDesignSystem" };
