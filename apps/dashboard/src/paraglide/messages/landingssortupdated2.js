/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingssortupdated2Inputs */

const vi_landingssortupdated2 =
  /** @type {(inputs: Landingssortupdated2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cập nhật gần nhất`;
  };

const en_landingssortupdated2 =
  /** @type {(inputs: Landingssortupdated2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Recently updated`;
  };

/**
 * | output |
 * | --- |
 * | "Recently updated" |
 *
 * @param {Landingssortupdated2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingssortupdated2 =
  /** @type {((inputs?: Landingssortupdated2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingssortupdated2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingssortupdated2(inputs);
      return vi_landingssortupdated2(inputs);
    }
  );
export { landingssortupdated2 as "landingsSortUpdated" };
