/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsassigntocampaignempty4Inputs */

const vi_landingsassigntocampaignempty4 =
  /** @type {(inputs: Landingsassigntocampaignempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có campaign nào — hãy tạo trước.`;
  };

const en_landingsassigntocampaignempty4 =
  /** @type {(inputs: Landingsassigntocampaignempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No campaigns yet — create one first.`;
  };

/**
 * | output |
 * | --- |
 * | "No campaigns yet — create one first." |
 *
 * @param {Landingsassigntocampaignempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsassigntocampaignempty4 =
  /** @type {((inputs?: Landingsassigntocampaignempty4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsassigntocampaignempty4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsassigntocampaignempty4(inputs);
      return vi_landingsassigntocampaignempty4(inputs);
    }
  );
export { landingsassigntocampaignempty4 as "landingsAssignToCampaignEmpty" };
