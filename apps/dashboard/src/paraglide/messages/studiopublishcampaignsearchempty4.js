/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishcampaignsearchempty4Inputs */

const vi_studiopublishcampaignsearchempty4 =
  /** @type {(inputs: Studiopublishcampaignsearchempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tìm thấy campaign nào.`;
  };

const en_studiopublishcampaignsearchempty4 =
  /** @type {(inputs: Studiopublishcampaignsearchempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No campaigns found.`;
  };

/**
 * | output |
 * | --- |
 * | "No campaigns found." |
 *
 * @param {Studiopublishcampaignsearchempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishcampaignsearchempty4 =
  /** @type {((inputs?: Studiopublishcampaignsearchempty4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishcampaignsearchempty4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishcampaignsearchempty4(inputs);
      return vi_studiopublishcampaignsearchempty4(inputs);
    }
  );
export { studiopublishcampaignsearchempty4 as "studioPublishCampaignSearchEmpty" };
