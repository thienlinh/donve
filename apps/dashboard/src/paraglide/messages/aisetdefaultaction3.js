/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aisetdefaultaction3Inputs */

const vi_aisetdefaultaction3 =
  /** @type {(inputs: Aisetdefaultaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đặt làm mặc định`;
  };

const en_aisetdefaultaction3 =
  /** @type {(inputs: Aisetdefaultaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Set as default`;
  };

/**
 * | output |
 * | --- |
 * | "Set as default" |
 *
 * @param {Aisetdefaultaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aisetdefaultaction3 =
  /** @type {((inputs?: Aisetdefaultaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aisetdefaultaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aisetdefaultaction3(inputs);
      return vi_aisetdefaultaction3(inputs);
    }
  );
export { aisetdefaultaction3 as "aiSetDefaultAction" };
