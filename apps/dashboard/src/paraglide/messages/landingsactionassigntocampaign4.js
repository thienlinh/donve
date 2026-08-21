/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsactionassigntocampaign4Inputs */

const vi_landingsactionassigntocampaign4 =
  /** @type {(inputs: Landingsactionassigntocampaign4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gắn vào campaign`;
  };

const en_landingsactionassigntocampaign4 =
  /** @type {(inputs: Landingsactionassigntocampaign4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assign to campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Assign to campaign" |
 *
 * @param {Landingsactionassigntocampaign4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsactionassigntocampaign4 =
  /** @type {((inputs?: Landingsactionassigntocampaign4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsactionassigntocampaign4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsactionassigntocampaign4(inputs);
      return vi_landingsactionassigntocampaign4(inputs);
    }
  );
export { landingsactionassigntocampaign4 as "landingsActionAssignToCampaign" };
