/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectioncolumnmodel3Inputs */

const vi_aiconnectioncolumnmodel3 =
  /** @type {(inputs: Aiconnectioncolumnmodel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Model mặc định`;
  };

const en_aiconnectioncolumnmodel3 =
  /** @type {(inputs: Aiconnectioncolumnmodel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Default model`;
  };

/**
 * | output |
 * | --- |
 * | "Default model" |
 *
 * @param {Aiconnectioncolumnmodel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectioncolumnmodel3 =
  /** @type {((inputs?: Aiconnectioncolumnmodel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectioncolumnmodel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectioncolumnmodel3(inputs);
      return vi_aiconnectioncolumnmodel3(inputs);
    }
  );
export { aiconnectioncolumnmodel3 as "aiConnectionColumnModel" };
