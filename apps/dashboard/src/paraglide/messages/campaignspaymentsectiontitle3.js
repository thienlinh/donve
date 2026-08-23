/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspaymentsectiontitle3Inputs */

const vi_campaignspaymentsectiontitle3 =
  /** @type {(inputs: Campaignspaymentsectiontitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thanh toán`;
  };

const en_campaignspaymentsectiontitle3 =
  /** @type {(inputs: Campaignspaymentsectiontitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Payment`;
  };

/**
 * | output |
 * | --- |
 * | "Payment" |
 *
 * @param {Campaignspaymentsectiontitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspaymentsectiontitle3 =
  /** @type {((inputs?: Campaignspaymentsectiontitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspaymentsectiontitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspaymentsectiontitle3(inputs);
      return vi_campaignspaymentsectiontitle3(inputs);
    }
  );
export { campaignspaymentsectiontitle3 as "campaignsPaymentSectionTitle" };
