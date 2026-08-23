/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentdeleteerrortoast4Inputs */

const vi_leadsassignmentdeleteerrortoast4 =
  /** @type {(inputs: Leadsassignmentdeleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xoá được quy tắc này. Thử lại.`;
  };

const en_leadsassignmentdeleteerrortoast4 =
  /** @type {(inputs: Leadsassignmentdeleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't delete this rule. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't delete this rule. Try again." |
 *
 * @param {Leadsassignmentdeleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentdeleteerrortoast4 =
  /** @type {((inputs?: Leadsassignmentdeleteerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentdeleteerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentdeleteerrortoast4(inputs);
      return vi_leadsassignmentdeleteerrortoast4(inputs);
    }
  );
export { leadsassignmentdeleteerrortoast4 as "leadsAssignmentDeleteErrorToast" };
