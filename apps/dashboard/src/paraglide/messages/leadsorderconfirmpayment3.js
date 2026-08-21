/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderconfirmpayment3Inputs */

const vi_leadsorderconfirmpayment3 =
  /** @type {(inputs: Leadsorderconfirmpayment3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xác nhận thanh toán`;
  };

const en_leadsorderconfirmpayment3 =
  /** @type {(inputs: Leadsorderconfirmpayment3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Confirm payment`;
  };

/**
 * | output |
 * | --- |
 * | "Confirm payment" |
 *
 * @param {Leadsorderconfirmpayment3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderconfirmpayment3 =
  /** @type {((inputs?: Leadsorderconfirmpayment3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderconfirmpayment3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderconfirmpayment3(inputs);
      return vi_leadsorderconfirmpayment3(inputs);
    }
  );
export { leadsorderconfirmpayment3 as "leadsOrderConfirmPayment" };
