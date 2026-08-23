/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectionsdescription2Inputs */

const vi_paymentconnectionsdescription2 =
  /** @type {(inputs: Paymentconnectionsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối tài khoản SePay của riêng bạn để nền tảng đọc thông báo thanh toán — tiền của khách hàng luôn vào thẳng tài khoản của bạn.`;
  };

const en_paymentconnectionsdescription2 =
  /** @type {(inputs: Paymentconnectionsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect your own SePay account so the platform can read payment notifications — your money always lands directly in your own account.`;
  };

/**
 * | output |
 * | --- |
 * | "Connect your own SePay account so the platform can read payment notifications — your money always lands directly in your own account." |
 *
 * @param {Paymentconnectionsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectionsdescription2 =
  /** @type {((inputs?: Paymentconnectionsdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectionsdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectionsdescription2(inputs);
      return vi_paymentconnectionsdescription2(inputs);
    }
  );
export { paymentconnectionsdescription2 as "paymentConnectionsDescription" };
