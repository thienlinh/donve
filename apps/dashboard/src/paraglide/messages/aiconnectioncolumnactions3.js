/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectioncolumnactions3Inputs */

const vi_aiconnectioncolumnactions3 =
  /** @type {(inputs: Aiconnectioncolumnactions3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hành động`;
  };

const en_aiconnectioncolumnactions3 =
  /** @type {(inputs: Aiconnectioncolumnactions3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Aiconnectioncolumnactions3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectioncolumnactions3 =
  /** @type {((inputs?: Aiconnectioncolumnactions3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectioncolumnactions3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectioncolumnactions3(inputs);
      return vi_aiconnectioncolumnactions3(inputs);
    }
  );
export { aiconnectioncolumnactions3 as "aiConnectionColumnActions" };
