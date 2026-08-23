/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentslalabel3Inputs */

const vi_leadsassignmentslalabel3 =
  /** @type {(inputs: Leadsassignmentslalabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SLA (giờ, tuỳ chọn)`;
  };

const en_leadsassignmentslalabel3 =
  /** @type {(inputs: Leadsassignmentslalabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SLA (hours, optional)`;
  };

/**
 * | output |
 * | --- |
 * | "SLA (hours, optional)" |
 *
 * @param {Leadsassignmentslalabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentslalabel3 =
  /** @type {((inputs?: Leadsassignmentslalabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentslalabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentslalabel3(inputs);
      return vi_leadsassignmentslalabel3(inputs);
    }
  );
export { leadsassignmentslalabel3 as "leadsAssignmentSlaLabel" };
