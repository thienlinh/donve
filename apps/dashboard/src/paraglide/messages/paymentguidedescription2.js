/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentguidedescription2Inputs */

const vi_paymentguidedescription2 =
  /** @type {(inputs: Paymentguidedescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Từng bước, từ tạo tài khoản SePay đến xác nhận kết nối hoạt động.`;
  };

const en_paymentguidedescription2 =
  /** @type {(inputs: Paymentguidedescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Step-by-step, from creating a SePay account to confirming the connection works.`;
  };

/**
 * | output |
 * | --- |
 * | "Step-by-step, from creating a SePay account to confirming the connection works." |
 *
 * @param {Paymentguidedescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentguidedescription2 =
  /** @type {((inputs?: Paymentguidedescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentguidedescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentguidedescription2(inputs);
      return vi_paymentguidedescription2(inputs);
    }
  );
export { paymentguidedescription2 as "paymentGuideDescription" };
