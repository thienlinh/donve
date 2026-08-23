/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgoogleadsdescription4Inputs */

const vi_leadswebhookgoogleadsdescription4 =
  /** @type {(inputs: Leadswebhookgoogleadsdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán URL và key dưới đây vào chính phần cài đặt webhook của Lead Form asset trong Google Ads — Google tự gửi mọi lead mới về đây theo thời gian thực, không cần polling hay công cụ trung gian.`;
  };

const en_leadswebhookgoogleadsdescription4 =
  /** @type {(inputs: Leadswebhookgoogleadsdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste the URL and key below into your Lead Form asset's own webhook settings in Google Ads — Google sends every new lead here in real time, no polling or third-party tool needed.`;
  };

/**
 * | output |
 * | --- |
 * | "Paste the URL and key below into your Lead Form asset's own webhook settings in Google Ads — Google sends every new lead here in real time, no polling or thi..." |
 *
 * @param {Leadswebhookgoogleadsdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgoogleadsdescription4 =
  /** @type {((inputs?: Leadswebhookgoogleadsdescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgoogleadsdescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgoogleadsdescription4(inputs);
      return vi_leadswebhookgoogleadsdescription4(inputs);
    }
  );
export { leadswebhookgoogleadsdescription4 as "leadsWebhookGoogleAdsDescription" };
