/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsstatuscompleted3Inputs */

const vi_refundrequestsstatuscompleted3 =
  /** @type {(inputs: Refundrequestsstatuscompleted3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã hoàn thành`;
  };

const en_refundrequestsstatuscompleted3 =
  /** @type {(inputs: Refundrequestsstatuscompleted3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Completed`;
  };

/**
 * | output |
 * | --- |
 * | "Completed" |
 *
 * @param {Refundrequestsstatuscompleted3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsstatuscompleted3 =
  /** @type {((inputs?: Refundrequestsstatuscompleted3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsstatuscompleted3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsstatuscompleted3(inputs);
      return vi_refundrequestsstatuscompleted3(inputs);
    }
  );
export { refundrequestsstatuscompleted3 as "refundRequestsStatusCompleted" };
