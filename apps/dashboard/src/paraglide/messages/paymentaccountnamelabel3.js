/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentaccountnamelabel3Inputs */

const vi_paymentaccountnamelabel3 =
  /** @type {(inputs: Paymentaccountnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên chủ tài khoản`;
  };

const en_paymentaccountnamelabel3 =
  /** @type {(inputs: Paymentaccountnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Account holder name`;
  };

/**
 * | output |
 * | --- |
 * | "Account holder name" |
 *
 * @param {Paymentaccountnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentaccountnamelabel3 =
  /** @type {((inputs?: Paymentaccountnamelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentaccountnamelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentaccountnamelabel3(inputs);
      return vi_paymentaccountnamelabel3(inputs);
    }
  );
export { paymentaccountnamelabel3 as "paymentAccountNameLabel" };
