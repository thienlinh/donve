/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsrepeatcustomerbadge3Inputs */

const vi_leadsrepeatcustomerbadge3 =
  /** @type {(inputs: Leadsrepeatcustomerbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khách quen`;
  };

const en_leadsrepeatcustomerbadge3 =
  /** @type {(inputs: Leadsrepeatcustomerbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Repeat customer`;
  };

/**
 * | output |
 * | --- |
 * | "Repeat customer" |
 *
 * @param {Leadsrepeatcustomerbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsrepeatcustomerbadge3 =
  /** @type {((inputs?: Leadsrepeatcustomerbadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsrepeatcustomerbadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsrepeatcustomerbadge3(inputs);
      return vi_leadsrepeatcustomerbadge3(inputs);
    }
  );
export { leadsrepeatcustomerbadge3 as "leadsRepeatCustomerBadge" };
