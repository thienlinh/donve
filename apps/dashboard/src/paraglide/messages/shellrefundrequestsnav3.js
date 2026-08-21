/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellrefundrequestsnav3Inputs */

const vi_shellrefundrequestsnav3 =
  /** @type {(inputs: Shellrefundrequestsnav3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Yêu cầu hoàn tiền`;
  };

const en_shellrefundrequestsnav3 =
  /** @type {(inputs: Shellrefundrequestsnav3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Refund requests`;
  };

/**
 * | output |
 * | --- |
 * | "Refund requests" |
 *
 * @param {Shellrefundrequestsnav3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellrefundrequestsnav3 =
  /** @type {((inputs?: Shellrefundrequestsnav3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellrefundrequestsnav3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellrefundrequestsnav3(inputs);
      return vi_shellrefundrequestsnav3(inputs);
    }
  );
export { shellrefundrequestsnav3 as "shellRefundRequestsNav" };
