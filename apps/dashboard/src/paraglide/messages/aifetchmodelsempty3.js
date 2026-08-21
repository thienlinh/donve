/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aifetchmodelsempty3Inputs */

const vi_aifetchmodelsempty3 =
  /** @type {(inputs: Aifetchmodelsempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tìm thấy model nào khả dụng.`;
  };

const en_aifetchmodelsempty3 =
  /** @type {(inputs: Aifetchmodelsempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No available models found.`;
  };

/**
 * | output |
 * | --- |
 * | "No available models found." |
 *
 * @param {Aifetchmodelsempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aifetchmodelsempty3 =
  /** @type {((inputs?: Aifetchmodelsempty3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aifetchmodelsempty3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aifetchmodelsempty3(inputs);
      return vi_aifetchmodelsempty3(inputs);
    }
  );
export { aifetchmodelsempty3 as "aiFetchModelsEmpty" };
