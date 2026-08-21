/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishcampaignsearchplaceholder4Inputs */

const vi_studiopublishcampaignsearchplaceholder4 =
  /** @type {(inputs: Studiopublishcampaignsearchplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tìm campaign…`;
  };

const en_studiopublishcampaignsearchplaceholder4 =
  /** @type {(inputs: Studiopublishcampaignsearchplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Search campaigns…`;
  };

/**
 * | output |
 * | --- |
 * | "Search campaigns…" |
 *
 * @param {Studiopublishcampaignsearchplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishcampaignsearchplaceholder4 =
  /** @type {((inputs?: Studiopublishcampaignsearchplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishcampaignsearchplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiopublishcampaignsearchplaceholder4(inputs);
      return vi_studiopublishcampaignsearchplaceholder4(inputs);
    }
  );
export { studiopublishcampaignsearchplaceholder4 as "studioPublishCampaignSearchPlaceholder" };
