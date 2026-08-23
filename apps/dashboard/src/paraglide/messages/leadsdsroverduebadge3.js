/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsroverduebadge3Inputs */

const vi_leadsdsroverduebadge3 =
  /** @type {(inputs: Leadsdsroverduebadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quá hạn`;
  };

const en_leadsdsroverduebadge3 =
  /** @type {(inputs: Leadsdsroverduebadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Overdue`;
  };

/**
 * | output |
 * | --- |
 * | "Overdue" |
 *
 * @param {Leadsdsroverduebadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsroverduebadge3 =
  /** @type {((inputs?: Leadsdsroverduebadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsroverduebadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsroverduebadge3(inputs);
      return vi_leadsdsroverduebadge3(inputs);
    }
  );
export { leadsdsroverduebadge3 as "leadsDsrOverdueBadge" };
