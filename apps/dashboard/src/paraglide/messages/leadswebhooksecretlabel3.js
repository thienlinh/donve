/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksecretlabel3Inputs */

const vi_leadswebhooksecretlabel3 =
  /** @type {(inputs: Leadswebhooksecretlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Secret (HMAC)`;
  };

const en_leadswebhooksecretlabel3 =
  /** @type {(inputs: Leadswebhooksecretlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Secret (HMAC)`;
  };

/**
 * | output |
 * | --- |
 * | "Secret (HMAC)" |
 *
 * @param {Leadswebhooksecretlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksecretlabel3 =
  /** @type {((inputs?: Leadswebhooksecretlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksecretlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksecretlabel3(inputs);
      return vi_leadswebhooksecretlabel3(inputs);
    }
  );
export { leadswebhooksecretlabel3 as "leadsWebhookSecretLabel" };
