/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentremoveconnectionaction3Inputs */

const vi_paymentremoveconnectionaction3 =
  /** @type {(inputs: Paymentremoveconnectionaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa kết nối`;
  };

const en_paymentremoveconnectionaction3 =
  /** @type {(inputs: Paymentremoveconnectionaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove connection`;
  };

/**
 * | output |
 * | --- |
 * | "Remove connection" |
 *
 * @param {Paymentremoveconnectionaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentremoveconnectionaction3 =
  /** @type {((inputs?: Paymentremoveconnectionaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentremoveconnectionaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentremoveconnectionaction3(inputs);
      return vi_paymentremoveconnectionaction3(inputs);
    }
  );
export { paymentremoveconnectionaction3 as "paymentRemoveConnectionAction" };
