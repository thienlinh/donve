/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingstepconnectpayment3Inputs */

const vi_onboardingstepconnectpayment3 =
  /** @type {(inputs: Onboardingstepconnectpayment3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối thanh toán để tự động nhận tiền`;
  };

const en_onboardingstepconnectpayment3 =
  /** @type {(inputs: Onboardingstepconnectpayment3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect a payment provider to get paid automatically`;
  };

/**
 * | output |
 * | --- |
 * | "Connect a payment provider to get paid automatically" |
 *
 * @param {Onboardingstepconnectpayment3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingstepconnectpayment3 =
  /** @type {((inputs?: Onboardingstepconnectpayment3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingstepconnectpayment3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_onboardingstepconnectpayment3(inputs);
      return vi_onboardingstepconnectpayment3(inputs);
    }
  );
export { onboardingstepconnectpayment3 as "onboardingStepConnectPayment" };
