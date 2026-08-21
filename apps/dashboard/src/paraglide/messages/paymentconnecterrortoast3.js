/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnecterrortoast3Inputs */

const vi_paymentconnecterrortoast3 =
  /** @type {(inputs: Paymentconnecterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không kết nối được tài khoản này. Kiểm tra lại thông tin và thử lại.`;
  };

const en_paymentconnecterrortoast3 =
  /** @type {(inputs: Paymentconnecterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't connect this account. Check the details and try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't connect this account. Check the details and try again." |
 *
 * @param {Paymentconnecterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnecterrortoast3 =
  /** @type {((inputs?: Paymentconnecterrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnecterrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnecterrortoast3(inputs);
      return vi_paymentconnecterrortoast3(inputs);
    }
  );
export { paymentconnecterrortoast3 as "paymentConnectErrorToast" };
