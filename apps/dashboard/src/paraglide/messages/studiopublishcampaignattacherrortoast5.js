/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishcampaignattacherrortoast5Inputs */

const vi_studiopublishcampaignattacherrortoast5 =
  /** @type {(inputs: Studiopublishcampaignattacherrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể gắn campaign. Vui lòng thử lại.`;
  };

const en_studiopublishcampaignattacherrortoast5 =
  /** @type {(inputs: Studiopublishcampaignattacherrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't attach campaign. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't attach campaign. Try again." |
 *
 * @param {Studiopublishcampaignattacherrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishcampaignattacherrortoast5 =
  /** @type {((inputs?: Studiopublishcampaignattacherrortoast5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishcampaignattacherrortoast5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_studiopublishcampaignattacherrortoast5(inputs);
      return vi_studiopublishcampaignattacherrortoast5(inputs);
    }
  );
export { studiopublishcampaignattacherrortoast5 as "studioPublishCampaignAttachErrorToast" };
