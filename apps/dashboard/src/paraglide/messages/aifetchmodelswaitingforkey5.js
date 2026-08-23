/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aifetchmodelswaitingforkey5Inputs */

const vi_aifetchmodelswaitingforkey5 =
  /** @type {(inputs: Aifetchmodelswaitingforkey5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhập API key để tải danh sách model`;
  };

const en_aifetchmodelswaitingforkey5 =
  /** @type {(inputs: Aifetchmodelswaitingforkey5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Enter an API key to load models`;
  };

/**
 * | output |
 * | --- |
 * | "Enter an API key to load models" |
 *
 * @param {Aifetchmodelswaitingforkey5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aifetchmodelswaitingforkey5 =
  /** @type {((inputs?: Aifetchmodelswaitingforkey5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aifetchmodelswaitingforkey5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aifetchmodelswaitingforkey5(inputs);
      return vi_aifetchmodelswaitingforkey5(inputs);
    }
  );
export { aifetchmodelswaitingforkey5 as "aiFetchModelsWaitingForKey" };
