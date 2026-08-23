/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectionstitle2Inputs */

const vi_aiconnectionstitle2 =
  /** @type {(inputs: Aiconnectionstitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối AI`;
  };

const en_aiconnectionstitle2 =
  /** @type {(inputs: Aiconnectionstitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI connections`;
  };

/**
 * | output |
 * | --- |
 * | "AI connections" |
 *
 * @param {Aiconnectionstitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectionstitle2 =
  /** @type {((inputs?: Aiconnectionstitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectionstitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectionstitle2(inputs);
      return vi_aiconnectionstitle2(inputs);
    }
  );
export { aiconnectionstitle2 as "aiConnectionsTitle" };
