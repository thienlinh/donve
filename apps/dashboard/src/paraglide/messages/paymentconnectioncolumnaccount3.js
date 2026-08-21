/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectioncolumnaccount3Inputs */

const vi_paymentconnectioncolumnaccount3 =
  /** @type {(inputs: Paymentconnectioncolumnaccount3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tài khoản`;
  };

const en_paymentconnectioncolumnaccount3 =
  /** @type {(inputs: Paymentconnectioncolumnaccount3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Account`;
  };

/**
 * | output |
 * | --- |
 * | "Account" |
 *
 * @param {Paymentconnectioncolumnaccount3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectioncolumnaccount3 =
  /** @type {((inputs?: Paymentconnectioncolumnaccount3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectioncolumnaccount3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectioncolumnaccount3(inputs);
      return vi_paymentconnectioncolumnaccount3(inputs);
    }
  );
export { paymentconnectioncolumnaccount3 as "paymentConnectionColumnAccount" };
