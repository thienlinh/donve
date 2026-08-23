/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksettingstitle3Inputs */

const vi_leadswebhooksettingstitle3 =
  /** @type {(inputs: Leadswebhooksettingstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Webhook nhận lead (Facebook/Zalo)`;
  };

const en_leadswebhooksettingstitle3 =
  /** @type {(inputs: Leadswebhooksettingstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lead webhooks (Facebook/Zalo)`;
  };

/**
 * | output |
 * | --- |
 * | "Lead webhooks (Facebook/Zalo)" |
 *
 * @param {Leadswebhooksettingstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksettingstitle3 =
  /** @type {((inputs?: Leadswebhooksettingstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksettingstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksettingstitle3(inputs);
      return vi_leadswebhooksettingstitle3(inputs);
    }
  );
export { leadswebhooksettingstitle3 as "leadsWebhookSettingsTitle" };
