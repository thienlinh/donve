/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsbadgedraft2Inputs */

const vi_landingsbadgedraft2 =
  /** @type {(inputs: Landingsbadgedraft2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nháp`;
  };

const en_landingsbadgedraft2 =
  /** @type {(inputs: Landingsbadgedraft2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Draft`;
  };

/**
 * | output |
 * | --- |
 * | "Draft" |
 *
 * @param {Landingsbadgedraft2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsbadgedraft2 =
  /** @type {((inputs?: Landingsbadgedraft2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsbadgedraft2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsbadgedraft2(inputs);
      return vi_landingsbadgedraft2(inputs);
    }
  );
export { landingsbadgedraft2 as "landingsBadgeDraft" };
