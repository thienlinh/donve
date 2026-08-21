/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishattachcampaignbutton4Inputs */

const vi_studiopublishattachcampaignbutton4 =
  /** @type {(inputs: Studiopublishattachcampaignbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gắn vào`;
  };

const en_studiopublishattachcampaignbutton4 =
  /** @type {(inputs: Studiopublishattachcampaignbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Attach`;
  };

/**
 * | output |
 * | --- |
 * | "Attach" |
 *
 * @param {Studiopublishattachcampaignbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishattachcampaignbutton4 =
  /** @type {((inputs?: Studiopublishattachcampaignbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishattachcampaignbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishattachcampaignbutton4(inputs);
      return vi_studiopublishattachcampaignbutton4(inputs);
    }
  );
export { studiopublishattachcampaignbutton4 as "studioPublishAttachCampaignButton" };
