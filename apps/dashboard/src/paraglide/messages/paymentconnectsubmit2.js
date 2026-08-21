/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectsubmit2Inputs */

const vi_paymentconnectsubmit2 =
  /** @type {(inputs: Paymentconnectsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối`;
  };

const en_paymentconnectsubmit2 =
  /** @type {(inputs: Paymentconnectsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect`;
  };

/**
 * | output |
 * | --- |
 * | "Connect" |
 *
 * @param {Paymentconnectsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectsubmit2 =
  /** @type {((inputs?: Paymentconnectsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectsubmit2(inputs);
      return vi_paymentconnectsubmit2(inputs);
    }
  );
export { paymentconnectsubmit2 as "paymentConnectSubmit" };
