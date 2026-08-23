/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestscolumnorder3Inputs */

const vi_refundrequestscolumnorder3 =
  /** @type {(inputs: Refundrequestscolumnorder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đơn hàng`;
  };

const en_refundrequestscolumnorder3 =
  /** @type {(inputs: Refundrequestscolumnorder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Order`;
  };

/**
 * | output |
 * | --- |
 * | "Order" |
 *
 * @param {Refundrequestscolumnorder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestscolumnorder3 =
  /** @type {((inputs?: Refundrequestscolumnorder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestscolumnorder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestscolumnorder3(inputs);
      return vi_refundrequestscolumnorder3(inputs);
    }
  );
export { refundrequestscolumnorder3 as "refundRequestsColumnOrder" };
