/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsbadgepublished2Inputs */

const vi_landingsbadgepublished2 =
  /** @type {(inputs: Landingsbadgepublished2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã đăng`;
  };

const en_landingsbadgepublished2 =
  /** @type {(inputs: Landingsbadgepublished2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Published`;
  };

/**
 * | output |
 * | --- |
 * | "Published" |
 *
 * @param {Landingsbadgepublished2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsbadgepublished2 =
  /** @type {((inputs?: Landingsbadgepublished2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsbadgepublished2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsbadgepublished2(inputs);
      return vi_landingsbadgepublished2(inputs);
    }
  );
export { landingsbadgepublished2 as "landingsBadgePublished" };
