/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusagecolumnmodel3Inputs */

const vi_aiusagecolumnmodel3 =
  /** @type {(inputs: Aiusagecolumnmodel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Model`;
  };

const en_aiusagecolumnmodel3 =
  /** @type {(inputs: Aiusagecolumnmodel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Model`;
  };

/**
 * | output |
 * | --- |
 * | "Model" |
 *
 * @param {Aiusagecolumnmodel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusagecolumnmodel3 =
  /** @type {((inputs?: Aiusagecolumnmodel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusagecolumnmodel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusagecolumnmodel3(inputs);
      return vi_aiusagecolumnmodel3(inputs);
    }
  );
export { aiusagecolumnmodel3 as "aiUsageColumnModel" };
