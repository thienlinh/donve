/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishcampaignattachedtoast4Inputs */

const vi_studiopublishcampaignattachedtoast4 =
  /** @type {(inputs: Studiopublishcampaignattachedtoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã gắn campaign`;
  };

const en_studiopublishcampaignattachedtoast4 =
  /** @type {(inputs: Studiopublishcampaignattachedtoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaign attached`;
  };

/**
 * | output |
 * | --- |
 * | "Campaign attached" |
 *
 * @param {Studiopublishcampaignattachedtoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishcampaignattachedtoast4 =
  /** @type {((inputs?: Studiopublishcampaignattachedtoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishcampaignattachedtoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiopublishcampaignattachedtoast4(inputs);
      return vi_studiopublishcampaignattachedtoast4(inputs);
    }
  );
export { studiopublishcampaignattachedtoast4 as "studioPublishCampaignAttachedToast" };
