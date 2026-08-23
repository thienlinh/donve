/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsreasoncustomer3Inputs */

const vi_refundrequestsreasoncustomer3 =
  /** @type {(inputs: Refundrequestsreasoncustomer3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khách yêu cầu`;
  };

const en_refundrequestsreasoncustomer3 =
  /** @type {(inputs: Refundrequestsreasoncustomer3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Customer request`;
  };

/**
 * | output |
 * | --- |
 * | "Customer request" |
 *
 * @param {Refundrequestsreasoncustomer3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsreasoncustomer3 =
  /** @type {((inputs?: Refundrequestsreasoncustomer3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsreasoncustomer3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsreasoncustomer3(inputs);
      return vi_refundrequestsreasoncustomer3(inputs);
    }
  );
export { refundrequestsreasoncustomer3 as "refundRequestsReasonCustomer" };
