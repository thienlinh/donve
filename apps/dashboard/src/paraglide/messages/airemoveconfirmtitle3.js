/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Airemoveconfirmtitle3Inputs */

const vi_airemoveconfirmtitle3 =
  /** @type {(inputs: Airemoveconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa kết nối này?`;
  };

const en_airemoveconfirmtitle3 =
  /** @type {(inputs: Airemoveconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove this connection?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove this connection?" |
 *
 * @param {Airemoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const airemoveconfirmtitle3 =
  /** @type {((inputs?: Airemoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Airemoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_airemoveconfirmtitle3(inputs);
      return vi_airemoveconfirmtitle3(inputs);
    }
  );
export { airemoveconfirmtitle3 as "aiRemoveConfirmTitle" };
