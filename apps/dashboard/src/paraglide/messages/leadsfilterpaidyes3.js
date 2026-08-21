/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterpaidyes3Inputs */

const vi_leadsfilterpaidyes3 =
  /** @type {(inputs: Leadsfilterpaidyes3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã thanh toán`;
  };

const en_leadsfilterpaidyes3 =
  /** @type {(inputs: Leadsfilterpaidyes3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paid`;
  };

/**
 * | output |
 * | --- |
 * | "Paid" |
 *
 * @param {Leadsfilterpaidyes3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterpaidyes3 =
  /** @type {((inputs?: Leadsfilterpaidyes3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterpaidyes3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterpaidyes3(inputs);
      return vi_leadsfilterpaidyes3(inputs);
    }
  );
export { leadsfilterpaidyes3 as "leadsFilterPaidYes" };
