/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Airemoveconnectionaction3Inputs */

const vi_airemoveconnectionaction3 =
  /** @type {(inputs: Airemoveconnectionaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa kết nối`;
  };

const en_airemoveconnectionaction3 =
  /** @type {(inputs: Airemoveconnectionaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove connection`;
  };

/**
 * | output |
 * | --- |
 * | "Remove connection" |
 *
 * @param {Airemoveconnectionaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const airemoveconnectionaction3 =
  /** @type {((inputs?: Airemoveconnectionaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Airemoveconnectionaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_airemoveconnectionaction3(inputs);
      return vi_airemoveconnectionaction3(inputs);
    }
  );
export { airemoveconnectionaction3 as "aiRemoveConnectionAction" };
