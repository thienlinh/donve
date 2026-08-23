/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsremitterlabel3Inputs */

const vi_refundrequestsremitterlabel3 =
  /** @type {(inputs: Refundrequestsremitterlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người chuyển khoản`;
  };

const en_refundrequestsremitterlabel3 =
  /** @type {(inputs: Refundrequestsremitterlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remitter`;
  };

/**
 * | output |
 * | --- |
 * | "Remitter" |
 *
 * @param {Refundrequestsremitterlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsremitterlabel3 =
  /** @type {((inputs?: Refundrequestsremitterlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsremitterlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsremitterlabel3(inputs);
      return vi_refundrequestsremitterlabel3(inputs);
    }
  );
export { refundrequestsremitterlabel3 as "refundRequestsRemitterLabel" };
