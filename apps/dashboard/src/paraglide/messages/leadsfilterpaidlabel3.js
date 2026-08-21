/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterpaidlabel3Inputs */

const vi_leadsfilterpaidlabel3 =
  /** @type {(inputs: Leadsfilterpaidlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thanh toán`;
  };

const en_leadsfilterpaidlabel3 =
  /** @type {(inputs: Leadsfilterpaidlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paid`;
  };

/**
 * | output |
 * | --- |
 * | "Paid" |
 *
 * @param {Leadsfilterpaidlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterpaidlabel3 =
  /** @type {((inputs?: Leadsfilterpaidlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterpaidlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterpaidlabel3(inputs);
      return vi_leadsfilterpaidlabel3(inputs);
    }
  );
export { leadsfilterpaidlabel3 as "leadsFilterPaidLabel" };
