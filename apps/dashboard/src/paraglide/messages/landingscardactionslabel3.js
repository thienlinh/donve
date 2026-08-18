/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingscardactionslabel3Inputs */

const vi_landingscardactionslabel3 =
  /** @type {(inputs: Landingscardactionslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thao tác landing page`;
  };

const en_landingscardactionslabel3 =
  /** @type {(inputs: Landingscardactionslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing page actions`;
  };

/**
 * | output |
 * | --- |
 * | "Landing page actions" |
 *
 * @param {Landingscardactionslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingscardactionslabel3 =
  /** @type {((inputs?: Landingscardactionslabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingscardactionslabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingscardactionslabel3(inputs);
      return vi_landingscardactionslabel3(inputs);
    }
  );
export { landingscardactionslabel3 as "landingsCardActionsLabel" };
