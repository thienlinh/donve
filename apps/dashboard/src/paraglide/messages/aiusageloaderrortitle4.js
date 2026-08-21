/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiusageloaderrortitle4Inputs */

const vi_aiusageloaderrortitle4 =
  /** @type {(inputs: Aiusageloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được dữ liệu sử dụng`;
  };

const en_aiusageloaderrortitle4 =
  /** @type {(inputs: Aiusageloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load usage`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load usage" |
 *
 * @param {Aiusageloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiusageloaderrortitle4 =
  /** @type {((inputs?: Aiusageloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiusageloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiusageloaderrortitle4(inputs);
      return vi_aiusageloaderrortitle4(inputs);
    }
  );
export { aiusageloaderrortitle4 as "aiUsageLoadErrorTitle" };
