/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aifetchmodelserror3Inputs */

const vi_aifetchmodelserror3 =
  /** @type {(inputs: Aifetchmodelserror3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách model — kiểm tra lại key.`;
  };

const en_aifetchmodelserror3 =
  /** @type {(inputs: Aifetchmodelserror3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load models for this key — check it's correct.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load models for this key — check it's correct." |
 *
 * @param {Aifetchmodelserror3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aifetchmodelserror3 =
  /** @type {((inputs?: Aifetchmodelserror3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aifetchmodelserror3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aifetchmodelserror3(inputs);
      return vi_aifetchmodelserror3(inputs);
    }
  );
export { aifetchmodelserror3 as "aiFetchModelsError" };
