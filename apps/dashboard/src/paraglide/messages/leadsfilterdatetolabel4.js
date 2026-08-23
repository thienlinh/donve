/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterdatetolabel4Inputs */

const vi_leadsfilterdatetolabel4 =
  /** @type {(inputs: Leadsfilterdatetolabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đến ngày`;
  };

const en_leadsfilterdatetolabel4 =
  /** @type {(inputs: Leadsfilterdatetolabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `To`;
  };

/**
 * | output |
 * | --- |
 * | "To" |
 *
 * @param {Leadsfilterdatetolabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterdatetolabel4 =
  /** @type {((inputs?: Leadsfilterdatetolabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterdatetolabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterdatetolabel4(inputs);
      return vi_leadsfilterdatetolabel4(inputs);
    }
  );
export { leadsfilterdatetolabel4 as "leadsFilterDateToLabel" };
