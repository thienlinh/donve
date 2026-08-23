/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestscolumnlead3Inputs */

const vi_refundrequestscolumnlead3 =
  /** @type {(inputs: Refundrequestscolumnlead3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khách hàng`;
  };

const en_refundrequestscolumnlead3 =
  /** @type {(inputs: Refundrequestscolumnlead3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lead`;
  };

/**
 * | output |
 * | --- |
 * | "Lead" |
 *
 * @param {Refundrequestscolumnlead3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestscolumnlead3 =
  /** @type {((inputs?: Refundrequestscolumnlead3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestscolumnlead3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestscolumnlead3(inputs);
      return vi_refundrequestscolumnlead3(inputs);
    }
  );
export { refundrequestscolumnlead3 as "refundRequestsColumnLead" };
