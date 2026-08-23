/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsfilterdraft2Inputs */

const vi_landingsfilterdraft2 =
  /** @type {(inputs: Landingsfilterdraft2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nháp`;
  };

const en_landingsfilterdraft2 =
  /** @type {(inputs: Landingsfilterdraft2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Draft`;
  };

/**
 * | output |
 * | --- |
 * | "Draft" |
 *
 * @param {Landingsfilterdraft2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsfilterdraft2 =
  /** @type {((inputs?: Landingsfilterdraft2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsfilterdraft2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsfilterdraft2(inputs);
      return vi_landingsfilterdraft2(inputs);
    }
  );
export { landingsfilterdraft2 as "landingsFilterDraft" };
