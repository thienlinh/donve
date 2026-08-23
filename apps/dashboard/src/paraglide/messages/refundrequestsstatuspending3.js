/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsstatuspending3Inputs */

const vi_refundrequestsstatuspending3 =
  /** @type {(inputs: Refundrequestsstatuspending3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chờ xử lý`;
  };

const en_refundrequestsstatuspending3 =
  /** @type {(inputs: Refundrequestsstatuspending3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pending`;
  };

/**
 * | output |
 * | --- |
 * | "Pending" |
 *
 * @param {Refundrequestsstatuspending3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsstatuspending3 =
  /** @type {((inputs?: Refundrequestsstatuspending3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsstatuspending3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsstatuspending3(inputs);
      return vi_refundrequestsstatuspending3(inputs);
    }
  );
export { refundrequestsstatuspending3 as "refundRequestsStatusPending" };
