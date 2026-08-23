/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadstotalpaidlabel3Inputs */

const vi_leadstotalpaidlabel3 =
  /** @type {(inputs: Leadstotalpaidlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tổng đã thanh toán`;
  };

const en_leadstotalpaidlabel3 =
  /** @type {(inputs: Leadstotalpaidlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Total paid`;
  };

/**
 * | output |
 * | --- |
 * | "Total paid" |
 *
 * @param {Leadstotalpaidlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadstotalpaidlabel3 =
  /** @type {((inputs?: Leadstotalpaidlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadstotalpaidlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadstotalpaidlabel3(inputs);
      return vi_leadstotalpaidlabel3(inputs);
    }
  );
export { leadstotalpaidlabel3 as "leadsTotalPaidLabel" };
