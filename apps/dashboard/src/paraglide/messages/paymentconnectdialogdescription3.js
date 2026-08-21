/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectdialogdescription3Inputs */

const vi_paymentconnectdialogdescription3 =
  /** @type {(inputs: Paymentconnectdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán thông tin tài khoản ngân hàng và API key webhook từ tài khoản SePay của bạn — xem hướng dẫn bên dưới nếu bạn chưa tạo tài khoản.`;
  };

const en_paymentconnectdialogdescription3 =
  /** @type {(inputs: Paymentconnectdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste the bank details and webhook API key from your own SePay account — see the guide below if you haven't created one yet.`;
  };

/**
 * | output |
 * | --- |
 * | "Paste the bank details and webhook API key from your own SePay account — see the guide below if you haven't created one yet." |
 *
 * @param {Paymentconnectdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectdialogdescription3 =
  /** @type {((inputs?: Paymentconnectdialogdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectdialogdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectdialogdescription3(inputs);
      return vi_paymentconnectdialogdescription3(inputs);
    }
  );
export { paymentconnectdialogdescription3 as "paymentConnectDialogDescription" };
