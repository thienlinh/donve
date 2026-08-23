/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgoogleadstitle4Inputs */

const vi_leadswebhookgoogleadstitle4 =
  /** @type {(inputs: Leadswebhookgoogleadstitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Google Ads (Lead Form)`;
  };

const en_leadswebhookgoogleadstitle4 =
  /** @type {(inputs: Leadswebhookgoogleadstitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Google Ads (Lead Form)`;
  };

/**
 * | output |
 * | --- |
 * | "Google Ads (Lead Form)" |
 *
 * @param {Leadswebhookgoogleadstitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgoogleadstitle4 =
  /** @type {((inputs?: Leadswebhookgoogleadstitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgoogleadstitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgoogleadstitle4(inputs);
      return vi_leadswebhookgoogleadstitle4(inputs);
    }
  );
export { leadswebhookgoogleadstitle4 as "leadsWebhookGoogleAdsTitle" };
