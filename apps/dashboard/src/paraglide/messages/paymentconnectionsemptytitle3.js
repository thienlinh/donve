/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paymentconnectionsemptytitle3Inputs */

const vi_paymentconnectionsemptytitle3 =
  /** @type {(inputs: Paymentconnectionsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có kết nối thanh toán nào`;
  };

const en_paymentconnectionsemptytitle3 =
  /** @type {(inputs: Paymentconnectionsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No payment connection yet`;
  };

/**
 * | output |
 * | --- |
 * | "No payment connection yet" |
 *
 * @param {Paymentconnectionsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const paymentconnectionsemptytitle3 =
  /** @type {((inputs?: Paymentconnectionsemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paymentconnectionsemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_paymentconnectionsemptytitle3(inputs);
      return vi_paymentconnectionsemptytitle3(inputs);
    }
  );
export { paymentconnectionsemptytitle3 as "paymentConnectionsEmptyTitle" };
