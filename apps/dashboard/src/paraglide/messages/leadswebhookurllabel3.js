/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookurllabel3Inputs */

const vi_leadswebhookurllabel3 =
  /** @type {(inputs: Leadswebhookurllabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `URL webhook (điền vào App Facebook/Zalo OA)`;
  };

const en_leadswebhookurllabel3 =
  /** @type {(inputs: Leadswebhookurllabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Webhook URL (paste into your Facebook/Zalo OA App)`;
  };

/**
 * | output |
 * | --- |
 * | "Webhook URL (paste into your Facebook/Zalo OA App)" |
 *
 * @param {Leadswebhookurllabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookurllabel3 =
  /** @type {((inputs?: Leadswebhookurllabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookurllabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookurllabel3(inputs);
      return vi_leadswebhookurllabel3(inputs);
    }
  );
export { leadswebhookurllabel3 as "leadsWebhookUrlLabel" };
