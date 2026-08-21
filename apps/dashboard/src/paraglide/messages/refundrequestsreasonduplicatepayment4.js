/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsreasonduplicatepayment4Inputs */

const vi_refundrequestsreasonduplicatepayment4 =
  /** @type {(inputs: Refundrequestsreasonduplicatepayment4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thanh toán trùng`;
  };

const en_refundrequestsreasonduplicatepayment4 =
  /** @type {(inputs: Refundrequestsreasonduplicatepayment4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Duplicate payment`;
  };

/**
 * | output |
 * | --- |
 * | "Duplicate payment" |
 *
 * @param {Refundrequestsreasonduplicatepayment4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsreasonduplicatepayment4 =
  /** @type {((inputs?: Refundrequestsreasonduplicatepayment4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsreasonduplicatepayment4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_refundrequestsreasonduplicatepayment4(inputs);
      return vi_refundrequestsreasonduplicatepayment4(inputs);
    }
  );
export { refundrequestsreasonduplicatepayment4 as "refundRequestsReasonDuplicatePayment" };
