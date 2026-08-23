/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectioncolumnbank3Inputs */

const vi_paymentconnectioncolumnbank3 =
  /** @type {(inputs: Paymentconnectioncolumnbank3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mã ngân hàng (BIN)`;
  };

const en_paymentconnectioncolumnbank3 =
  /** @type {(inputs: Paymentconnectioncolumnbank3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bank BIN`;
  };

/**
 * | output |
 * | --- |
 * | "Bank BIN" |
 *
 * @param {Paymentconnectioncolumnbank3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectioncolumnbank3 =
  /** @type {((inputs?: Paymentconnectioncolumnbank3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectioncolumnbank3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectioncolumnbank3(inputs);
      return vi_paymentconnectioncolumnbank3(inputs);
    }
  );
export { paymentconnectioncolumnbank3 as "paymentConnectionColumnBank" };
