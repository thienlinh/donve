/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiapikeylabel3Inputs */

const vi_aiapikeylabel3 =
  /** @type {(inputs: Aiapikeylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API key`;
  };

const en_aiapikeylabel3 =
  /** @type {(inputs: Aiapikeylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API key`;
  };

/**
 * | output |
 * | --- |
 * | "API key" |
 *
 * @param {Aiapikeylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiapikeylabel3 =
  /** @type {((inputs?: Aiapikeylabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiapikeylabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiapikeylabel3(inputs);
      return vi_aiapikeylabel3(inputs);
    }
  );
export { aiapikeylabel3 as "aiApiKeyLabel" };
