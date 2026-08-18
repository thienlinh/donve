/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsnoresultstitle3Inputs */

const vi_landingsnoresultstitle3 =
  /** @type {(inputs: Landingsnoresultstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có landing nào khớp bộ lọc`;
  };

const en_landingsnoresultstitle3 =
  /** @type {(inputs: Landingsnoresultstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No landing pages match these filters`;
  };

/**
 * | output |
 * | --- |
 * | "No landing pages match these filters" |
 *
 * @param {Landingsnoresultstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsnoresultstitle3 =
  /** @type {((inputs?: Landingsnoresultstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsnoresultstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsnoresultstitle3(inputs);
      return vi_landingsnoresultstitle3(inputs);
    }
  );
export { landingsnoresultstitle3 as "landingsNoResultsTitle" };
