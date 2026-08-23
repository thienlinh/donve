/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Airemoveconnectionerrortoast4Inputs */

const vi_airemoveconnectionerrortoast4 =
  /** @type {(inputs: Airemoveconnectionerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xóa được kết nối này. Vui lòng thử lại.`;
  };

const en_airemoveconnectionerrortoast4 =
  /** @type {(inputs: Airemoveconnectionerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this connection. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this connection. Try again." |
 *
 * @param {Airemoveconnectionerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const airemoveconnectionerrortoast4 =
  /** @type {((inputs?: Airemoveconnectionerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Airemoveconnectionerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_airemoveconnectionerrortoast4(inputs);
      return vi_airemoveconnectionerrortoast4(inputs);
    }
  );
export { airemoveconnectionerrortoast4 as "aiRemoveConnectionErrorToast" };
