/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectionstitle2Inputs */

const vi_paymentconnectionstitle2 =
  /** @type {(inputs: Paymentconnectionstitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối thanh toán`;
  };

const en_paymentconnectionstitle2 =
  /** @type {(inputs: Paymentconnectionstitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Payment connections`;
  };

/**
 * | output |
 * | --- |
 * | "Payment connections" |
 *
 * @param {Paymentconnectionstitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectionstitle2 =
  /** @type {((inputs?: Paymentconnectionstitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectionstitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectionstitle2(inputs);
      return vi_paymentconnectionstitle2(inputs);
    }
  );
export { paymentconnectionstitle2 as "paymentConnectionsTitle" };
