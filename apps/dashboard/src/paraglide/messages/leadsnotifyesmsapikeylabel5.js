/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmsapikeylabel5Inputs */

const vi_leadsnotifyesmsapikeylabel5 =
  /** @type {(inputs: Leadsnotifyesmsapikeylabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API key`;
  };

const en_leadsnotifyesmsapikeylabel5 =
  /** @type {(inputs: Leadsnotifyesmsapikeylabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API key`;
  };

/**
 * | output |
 * | --- |
 * | "API key" |
 *
 * @param {Leadsnotifyesmsapikeylabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmsapikeylabel5 =
  /** @type {((inputs?: Leadsnotifyesmsapikeylabel5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmsapikeylabel5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyesmsapikeylabel5(inputs);
      return vi_leadsnotifyesmsapikeylabel5(inputs);
    }
  );
export { leadsnotifyesmsapikeylabel5 as "leadsNotifyEsmsApiKeyLabel" };
