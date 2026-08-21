/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsnodesignsystem3Inputs */

const vi_landingsnodesignsystem3 =
  /** @type {(inputs: Landingsnodesignsystem3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có Brand Kit — thiết lập ngay`;
  };

const en_landingsnodesignsystem3 =
  /** @type {(inputs: Landingsnodesignsystem3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No Brand Kit yet — set one up`;
  };

/**
 * | output |
 * | --- |
 * | "No Brand Kit yet — set one up" |
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
