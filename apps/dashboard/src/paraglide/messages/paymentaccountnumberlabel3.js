/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentaccountnumberlabel3Inputs */

const vi_paymentaccountnumberlabel3 =
  /** @type {(inputs: Paymentaccountnumberlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số tài khoản`;
  };

const en_paymentaccountnumberlabel3 =
  /** @type {(inputs: Paymentaccountnumberlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Account number`;
  };

/**
 * | output |
 * | --- |
 * | "Account number" |
 *
 * @param {Paymentaccountnumberlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentaccountnumberlabel3 =
  /** @type {((inputs?: Paymentaccountnumberlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentaccountnumberlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentaccountnumberlabel3(inputs);
      return vi_paymentaccountnumberlabel3(inputs);
    }
  );
export { paymentaccountnumberlabel3 as "paymentAccountNumberLabel" };
