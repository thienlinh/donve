/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsevidencelabel3Inputs */

const vi_refundrequestsevidencelabel3 =
  /** @type {(inputs: Refundrequestsevidencelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ảnh chụp biên lai`;
  };

const en_refundrequestsevidencelabel3 =
  /** @type {(inputs: Refundrequestsevidencelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Transfer receipt`;
  };

/**
 * | output |
 * | --- |
 * | "Transfer receipt" |
 *
 * @param {Refundrequestsevidencelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsevidencelabel3 =
  /** @type {((inputs?: Refundrequestsevidencelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsevidencelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsevidencelabel3(inputs);
      return vi_refundrequestsevidencelabel3(inputs);
    }
  );
export { refundrequestsevidencelabel3 as "refundRequestsEvidenceLabel" };
