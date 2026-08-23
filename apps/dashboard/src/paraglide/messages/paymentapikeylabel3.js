/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentapikeylabel3Inputs */

const vi_paymentapikeylabel3 =
  /** @type {(inputs: Paymentapikeylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API key webhook`;
  };

const en_paymentapikeylabel3 =
  /** @type {(inputs: Paymentapikeylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Webhook API key`;
  };

/**
 * | output |
 * | --- |
 * | "Webhook API key" |
 *
 * @param {Paymentapikeylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentapikeylabel3 =
  /** @type {((inputs?: Paymentapikeylabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentapikeylabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentapikeylabel3(inputs);
      return vi_paymentapikeylabel3(inputs);
    }
  );
export { paymentapikeylabel3 as "paymentApiKeyLabel" };
