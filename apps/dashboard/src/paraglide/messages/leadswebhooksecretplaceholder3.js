/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksecretplaceholder3Inputs */

const vi_leadswebhooksecretplaceholder3 =
  /** @type {(inputs: Leadswebhooksecretplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán App Secret / Zalo OA secret vào đây`;
  };

const en_leadswebhooksecretplaceholder3 =
  /** @type {(inputs: Leadswebhooksecretplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste your Facebook App Secret / Zalo OA secret`;
  };

/**
 * | output |
 * | --- |
 * | "Paste your Facebook App Secret / Zalo OA secret" |
 *
 * @param {Leadswebhooksecretplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksecretplaceholder3 =
  /** @type {((inputs?: Leadswebhooksecretplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksecretplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksecretplaceholder3(inputs);
      return vi_leadswebhooksecretplaceholder3(inputs);
    }
  );
export { leadswebhooksecretplaceholder3 as "leadsWebhookSecretPlaceholder" };
