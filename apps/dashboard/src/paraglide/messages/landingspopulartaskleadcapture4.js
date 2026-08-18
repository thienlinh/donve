/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingspopulartaskleadcapture4Inputs */

const vi_landingspopulartaskleadcapture4 =
  /** @type {(inputs: Landingspopulartaskleadcapture4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thu thập lead bằng form`;
  };

const en_landingspopulartaskleadcapture4 =
  /** @type {(inputs: Landingspopulartaskleadcapture4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Capture leads with a form`;
  };

/**
 * | output |
 * | --- |
 * | "Capture leads with a form" |
 *
 * @param {Landingspopulartaskleadcapture4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingspopulartaskleadcapture4 =
  /** @type {((inputs?: Landingspopulartaskleadcapture4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingspopulartaskleadcapture4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingspopulartaskleadcapture4(inputs);
      return vi_landingspopulartaskleadcapture4(inputs);
    }
  );
export { landingspopulartaskleadcapture4 as "landingsPopularTaskLeadCapture" };
