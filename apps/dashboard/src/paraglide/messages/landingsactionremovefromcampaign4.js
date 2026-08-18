/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsactionremovefromcampaign4Inputs */

const vi_landingsactionremovefromcampaign4 =
  /** @type {(inputs: Landingsactionremovefromcampaign4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gỡ khỏi campaign`;
  };

const en_landingsactionremovefromcampaign4 =
  /** @type {(inputs: Landingsactionremovefromcampaign4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove from campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Remove from campaign" |
 *
 * @param {Landingsactionremovefromcampaign4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsactionremovefromcampaign4 =
  /** @type {((inputs?: Landingsactionremovefromcampaign4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsactionremovefromcampaign4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsactionremovefromcampaign4(inputs);
      return vi_landingsactionremovefromcampaign4(inputs);
    }
  );
export { landingsactionremovefromcampaign4 as "landingsActionRemoveFromCampaign" };
