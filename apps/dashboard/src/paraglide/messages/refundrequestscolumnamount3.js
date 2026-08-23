/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestscolumnamount3Inputs */

const vi_refundrequestscolumnamount3 =
  /** @type {(inputs: Refundrequestscolumnamount3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số tiền`;
  };

const en_refundrequestscolumnamount3 =
  /** @type {(inputs: Refundrequestscolumnamount3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Amount`;
  };

/**
 * | output |
 * | --- |
 * | "Amount" |
 *
 * @param {Refundrequestscolumnamount3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestscolumnamount3 =
  /** @type {((inputs?: Refundrequestscolumnamount3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestscolumnamount3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestscolumnamount3(inputs);
      return vi_refundrequestscolumnamount3(inputs);
    }
  );
export { refundrequestscolumnamount3 as "refundRequestsColumnAmount" };
