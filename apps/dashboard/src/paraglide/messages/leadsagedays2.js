/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Leadsagedays2Inputs */

const vi_leadsagedays2 =
  /** @type {(inputs: Leadsagedays2Inputs) => LocalizedString} */ (i) => {
    return /** @type {LocalizedString} */ `${i?.days} ngày`;
  };

const en_leadsagedays2 =
  /** @type {(inputs: Leadsagedays2Inputs) => LocalizedString} */ (i) => {
    return /** @type {LocalizedString} */ `${i?.days}d`;
  };

/**
 * | output |
 * | --- |
 * | "{days}d" |
 *
 * @param {Leadsagedays2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsagedays2 =
  /** @type {((inputs: Leadsagedays2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsagedays2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsagedays2(inputs);
      return vi_leadsagedays2(inputs);
    }
  );
export { leadsagedays2 as "leadsAgeDays" };
