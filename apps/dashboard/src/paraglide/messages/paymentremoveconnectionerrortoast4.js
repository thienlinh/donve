/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentremoveconnectionerrortoast4Inputs */

const vi_paymentremoveconnectionerrortoast4 =
  /** @type {(inputs: Paymentremoveconnectionerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xóa được kết nối này. Vui lòng thử lại.`;
  };

const en_paymentremoveconnectionerrortoast4 =
  /** @type {(inputs: Paymentremoveconnectionerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this connection. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this connection. Try again." |
 *
 * @param {Paymentremoveconnectionerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentremoveconnectionerrortoast4 =
  /** @type {((inputs?: Paymentremoveconnectionerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentremoveconnectionerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentremoveconnectionerrortoast4(inputs);
      return vi_paymentremoveconnectionerrortoast4(inputs);
    }
  );
export { paymentremoveconnectionerrortoast4 as "paymentRemoveConnectionErrorToast" };
