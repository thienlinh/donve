/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsfilterpublished2Inputs */

const vi_landingsfilterpublished2 =
  /** @type {(inputs: Landingsfilterpublished2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã đăng`;
  };

const en_landingsfilterpublished2 =
  /** @type {(inputs: Landingsfilterpublished2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Published`;
  };

/**
 * | output |
 * | --- |
 * | "Published" |
 *
 * @param {Landingsfilterpublished2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsfilterpublished2 =
  /** @type {((inputs?: Landingsfilterpublished2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsfilterpublished2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsfilterpublished2(inputs);
      return vi_landingsfilterpublished2(inputs);
    }
  );
export { landingsfilterpublished2 as "landingsFilterPublished" };
