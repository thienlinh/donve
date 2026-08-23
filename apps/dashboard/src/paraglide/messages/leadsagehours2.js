/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown> }} Leadsagehours2Inputs */

const vi_leadsagehours2 =
  /** @type {(inputs: Leadsagehours2Inputs) => LocalizedString} */ (i) => {
    return /** @type {LocalizedString} */ `${i?.hours} giờ`;
  };

const en_leadsagehours2 =
  /** @type {(inputs: Leadsagehours2Inputs) => LocalizedString} */ (i) => {
    return /** @type {LocalizedString} */ `${i?.hours}h`;
  };

/**
 * | output |
 * | --- |
 * | "{hours}h" |
 *
 * @param {Leadsagehours2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsagehours2 =
  /** @type {((inputs: Leadsagehours2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsagehours2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsagehours2(inputs);
      return vi_leadsagehours2(inputs);
    }
  );
export { leadsagehours2 as "leadsAgeHours" };
