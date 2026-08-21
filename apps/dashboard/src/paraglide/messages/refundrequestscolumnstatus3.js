/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestscolumnstatus3Inputs */

const vi_refundrequestscolumnstatus3 =
  /** @type {(inputs: Refundrequestscolumnstatus3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_refundrequestscolumnstatus3 =
  /** @type {(inputs: Refundrequestscolumnstatus3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Status`;
  };

/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Refundrequestscolumnstatus3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestscolumnstatus3 =
  /** @type {((inputs?: Refundrequestscolumnstatus3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestscolumnstatus3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestscolumnstatus3(inputs);
      return vi_refundrequestscolumnstatus3(inputs);
    }
  );
export { refundrequestscolumnstatus3 as "refundRequestsColumnStatus" };
