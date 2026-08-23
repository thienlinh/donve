/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivitypayment2Inputs */

const vi_leadsactivitypayment2 =
  /** @type {(inputs: Leadsactivitypayment2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã xác nhận thanh toán`;
  };

const en_leadsactivitypayment2 =
  /** @type {(inputs: Leadsactivitypayment2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Payment confirmed`;
  };

/**
 * | output |
 * | --- |
 * | "Payment confirmed" |
 *
 * @param {Leadsactivitypayment2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivitypayment2 =
  /** @type {((inputs?: Leadsactivitypayment2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivitypayment2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivitypayment2(inputs);
      return vi_leadsactivitypayment2(inputs);
    }
  );
export { leadsactivitypayment2 as "leadsActivityPayment" };
