/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingssearchplaceholder2Inputs */

const vi_landingssearchplaceholder2 =
  /** @type {(inputs: Landingssearchplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tìm theo tên…`;
  };

const en_landingssearchplaceholder2 =
  /** @type {(inputs: Landingssearchplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Search by name…`;
  };

/**
 * | output |
 * | --- |
 * | "Search by name…" |
 *
 * @param {Landingssearchplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingssearchplaceholder2 =
  /** @type {((inputs?: Landingssearchplaceholder2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingssearchplaceholder2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingssearchplaceholder2(inputs);
      return vi_landingssearchplaceholder2(inputs);
    }
  );
export { landingssearchplaceholder2 as "landingsSearchPlaceholder" };
