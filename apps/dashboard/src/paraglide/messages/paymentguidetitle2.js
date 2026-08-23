/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentguidetitle2Inputs */

const vi_paymentguidetitle2 =
  /** @type {(inputs: Paymentguidetitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hướng dẫn kết nối SePay`;
  };

const en_paymentguidetitle2 =
  /** @type {(inputs: Paymentguidetitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `How to connect SePay`;
  };

/**
 * | output |
 * | --- |
 * | "How to connect SePay" |
 *
 * @param {Paymentguidetitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentguidetitle2 =
  /** @type {((inputs?: Paymentguidetitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentguidetitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentguidetitle2(inputs);
      return vi_paymentguidetitle2(inputs);
    }
  );
export { paymentguidetitle2 as "paymentGuideTitle" };
