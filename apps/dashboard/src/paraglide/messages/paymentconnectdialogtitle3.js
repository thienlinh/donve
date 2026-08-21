/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectdialogtitle3Inputs */

const vi_paymentconnectdialogtitle3 =
  /** @type {(inputs: Paymentconnectdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối tài khoản SePay`;
  };

const en_paymentconnectdialogtitle3 =
  /** @type {(inputs: Paymentconnectdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect your SePay account`;
  };

/**
 * | output |
 * | --- |
 * | "Connect your SePay account" |
 *
 * @param {Paymentconnectdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectdialogtitle3 =
  /** @type {((inputs?: Paymentconnectdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectdialogtitle3(inputs);
      return vi_paymentconnectdialogtitle3(inputs);
    }
  );
export { paymentconnectdialogtitle3 as "paymentConnectDialogTitle" };
