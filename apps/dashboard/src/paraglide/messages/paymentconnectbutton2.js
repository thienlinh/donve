/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectbutton2Inputs */

const vi_paymentconnectbutton2 =
  /** @type {(inputs: Paymentconnectbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối SePay`;
  };

const en_paymentconnectbutton2 =
  /** @type {(inputs: Paymentconnectbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect SePay`;
  };

/**
 * | output |
 * | --- |
 * | "Connect SePay" |
 *
 * @param {Paymentconnectbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectbutton2 =
  /** @type {((inputs?: Paymentconnectbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectbutton2(inputs);
      return vi_paymentconnectbutton2(inputs);
    }
  );
export { paymentconnectbutton2 as "paymentConnectButton" };
