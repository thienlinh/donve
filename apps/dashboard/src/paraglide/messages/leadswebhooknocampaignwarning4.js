/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooknocampaignwarning4Inputs */

const vi_leadswebhooknocampaignwarning4 =
  /** @type {(inputs: Leadswebhooknocampaignwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn 1 chiến dịch ở trên để có URL webhook dùng được ngay — mỗi lead cần biết đổ vào chiến dịch nào.`;
  };

const en_leadswebhooknocampaignwarning4 =
  /** @type {(inputs: Leadswebhooknocampaignwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Select a campaign above to get a working webhook URL — every lead needs to know which campaign it belongs to.`;
  };

/**
 * | output |
 * | --- |
 * | "Select a campaign above to get a working webhook URL — every lead needs to know which campaign it belongs to." |
 *
 * @param {Leadswebhooknocampaignwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooknocampaignwarning4 =
  /** @type {((inputs?: Leadswebhooknocampaignwarning4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooknocampaignwarning4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooknocampaignwarning4(inputs);
      return vi_leadswebhooknocampaignwarning4(inputs);
    }
  );
export { leadswebhooknocampaignwarning4 as "leadsWebhookNoCampaignWarning" };
