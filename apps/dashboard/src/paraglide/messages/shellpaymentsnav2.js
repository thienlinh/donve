/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellpaymentsnav2Inputs */

const vi_shellpaymentsnav2 =
  /** @type {(inputs: Shellpaymentsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thanh toán`;
  };

const en_shellpaymentsnav2 =
  /** @type {(inputs: Shellpaymentsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Payments`;
  };

/**
 * | output |
 * | --- |
 * | "Payments" |
 *
 * @param {Shellpaymentsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellpaymentsnav2 =
  /** @type {((inputs?: Shellpaymentsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellpaymentsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellpaymentsnav2(inputs);
      return vi_shellpaymentsnav2(inputs);
    }
  );
export { shellpaymentsnav2 as "shellPaymentsNav" };
