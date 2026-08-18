/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusagecolumntokens3Inputs */

const vi_aiusagecolumntokens3 =
  /** @type {(inputs: Aiusagecolumntokens3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Token`;
  };

const en_aiusagecolumntokens3 =
  /** @type {(inputs: Aiusagecolumntokens3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tokens`;
  };

/**
 * | output |
 * | --- |
 * | "Tokens" |
 *
 * @param {Aiusagecolumntokens3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusagecolumntokens3 =
  /** @type {((inputs?: Aiusagecolumntokens3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusagecolumntokens3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusagecolumntokens3(inputs);
      return vi_aiusagecolumntokens3(inputs);
    }
  );
export { aiusagecolumntokens3 as "aiUsageColumnTokens" };
