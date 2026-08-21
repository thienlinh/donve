/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectioncolumnstatus3Inputs */

const vi_paymentconnectioncolumnstatus3 =
  /** @type {(inputs: Paymentconnectioncolumnstatus3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_paymentconnectioncolumnstatus3 =
  /** @type {(inputs: Paymentconnectioncolumnstatus3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Status`;
  };

/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Paymentconnectioncolumnstatus3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectioncolumnstatus3 =
  /** @type {((inputs?: Paymentconnectioncolumnstatus3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectioncolumnstatus3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectioncolumnstatus3(inputs);
      return vi_paymentconnectioncolumnstatus3(inputs);
    }
  );
export { paymentconnectioncolumnstatus3 as "paymentConnectionColumnStatus" };
