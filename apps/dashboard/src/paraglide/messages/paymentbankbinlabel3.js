/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentbankbinlabel3Inputs */

const vi_paymentbankbinlabel3 =
  /** @type {(inputs: Paymentbankbinlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mã ngân hàng (BIN)`;
  };

const en_paymentbankbinlabel3 =
  /** @type {(inputs: Paymentbankbinlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bank BIN`;
  };

/**
 * | output |
 * | --- |
 * | "Bank BIN" |
 *
 * @param {Paymentbankbinlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentbankbinlabel3 =
  /** @type {((inputs?: Paymentbankbinlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentbankbinlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentbankbinlabel3(inputs);
      return vi_paymentbankbinlabel3(inputs);
    }
  );
export { paymentbankbinlabel3 as "paymentBankBinLabel" };
