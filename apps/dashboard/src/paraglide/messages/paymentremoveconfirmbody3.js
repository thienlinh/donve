/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentremoveconfirmbody3Inputs */

const vi_paymentremoveconfirmbody3 =
  /** @type {(inputs: Paymentremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nền tảng sẽ ngừng đọc thông báo thanh toán cho đến khi bạn kết nối tài khoản khác.`;
  };

const en_paymentremoveconfirmbody3 =
  /** @type {(inputs: Paymentremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Payment notifications will stop being read until you connect another account.`;
  };

/**
 * | output |
 * | --- |
 * | "Payment notifications will stop being read until you connect another account." |
 *
 * @param {Paymentremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentremoveconfirmbody3 =
  /** @type {((inputs?: Paymentremoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentremoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentremoveconfirmbody3(inputs);
      return vi_paymentremoveconfirmbody3(inputs);
    }
  );
export { paymentremoveconfirmbody3 as "paymentRemoveConfirmBody" };
