/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequeststitle2Inputs */

const vi_refundrequeststitle2 =
  /** @type {(inputs: Refundrequeststitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Yêu cầu hoàn tiền`;
  };

const en_refundrequeststitle2 =
  /** @type {(inputs: Refundrequeststitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Refund requests`;
  };

/**
 * | output |
 * | --- |
 * | "Refund requests" |
 *
 * @param {Refundrequeststitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequeststitle2 =
  /** @type {((inputs?: Refundrequeststitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequeststitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequeststitle2(inputs);
      return vi_refundrequeststitle2(inputs);
    }
  );
export { refundrequeststitle2 as "refundRequestsTitle" };
