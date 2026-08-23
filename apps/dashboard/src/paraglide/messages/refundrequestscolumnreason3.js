/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestscolumnreason3Inputs */

const vi_refundrequestscolumnreason3 =
  /** @type {(inputs: Refundrequestscolumnreason3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lý do`;
  };

const en_refundrequestscolumnreason3 =
  /** @type {(inputs: Refundrequestscolumnreason3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reason`;
  };

/**
 * | output |
 * | --- |
 * | "Reason" |
 *
 * @param {Refundrequestscolumnreason3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestscolumnreason3 =
  /** @type {((inputs?: Refundrequestscolumnreason3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestscolumnreason3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestscolumnreason3(inputs);
      return vi_refundrequestscolumnreason3(inputs);
    }
  );
export { refundrequestscolumnreason3 as "refundRequestsColumnReason" };
