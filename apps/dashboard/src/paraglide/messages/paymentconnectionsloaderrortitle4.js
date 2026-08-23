/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectionsloaderrortitle4Inputs */

const vi_paymentconnectionsloaderrortitle4 =
  /** @type {(inputs: Paymentconnectionsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được kết nối thanh toán`;
  };

const en_paymentconnectionsloaderrortitle4 =
  /** @type {(inputs: Paymentconnectionsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load payment connections`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load payment connections" |
 *
 * @param {Paymentconnectionsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectionsloaderrortitle4 =
  /** @type {((inputs?: Paymentconnectionsloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectionsloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectionsloaderrortitle4(inputs);
      return vi_paymentconnectionsloaderrortitle4(inputs);
    }
  );
export { paymentconnectionsloaderrortitle4 as "paymentConnectionsLoadErrorTitle" };
