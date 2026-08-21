/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentremoveconfirmtitle3Inputs */

const vi_paymentremoveconfirmtitle3 =
  /** @type {(inputs: Paymentremoveconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa kết nối này?`;
  };

const en_paymentremoveconfirmtitle3 =
  /** @type {(inputs: Paymentremoveconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove this connection?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove this connection?" |
 *
 * @param {Paymentremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentremoveconfirmtitle3 =
  /** @type {((inputs?: Paymentremoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentremoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentremoveconfirmtitle3(inputs);
      return vi_paymentremoveconfirmtitle3(inputs);
    }
  );
export { paymentremoveconfirmtitle3 as "paymentRemoveConfirmTitle" };
