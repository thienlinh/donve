/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsusingbrandkit3Inputs */

const vi_landingsusingbrandkit3 =
  /** @type {(inputs: Landingsusingbrandkit3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang dùng Brand Kit của bạn`;
  };

const en_landingsusingbrandkit3 =
  /** @type {(inputs: Landingsusingbrandkit3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Using your Brand Kit`;
  };

/**
 * | output |
 * | --- |
 * | "Using your Brand Kit" |
 *
 * @param {Landingsusingbrandkit3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsusingbrandkit3 =
  /** @type {((inputs?: Landingsusingbrandkit3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsusingbrandkit3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsusingbrandkit3(inputs);
      return vi_landingsusingbrandkit3(inputs);
    }
  );
export { landingsusingbrandkit3 as "landingsUsingBrandKit" };
