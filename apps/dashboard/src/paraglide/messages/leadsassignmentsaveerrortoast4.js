/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentsaveerrortoast4Inputs */

const vi_leadsassignmentsaveerrortoast4 =
  /** @type {(inputs: Leadsassignmentsaveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được quy tắc này. Thử lại.`;
  };

const en_leadsassignmentsaveerrortoast4 =
  /** @type {(inputs: Leadsassignmentsaveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this rule. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this rule. Try again." |
 *
 * @param {Leadsassignmentsaveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentsaveerrortoast4 =
  /** @type {((inputs?: Leadsassignmentsaveerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentsaveerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentsaveerrortoast4(inputs);
      return vi_leadsassignmentsaveerrortoast4(inputs);
    }
  );
export { leadsassignmentsaveerrortoast4 as "leadsAssignmentSaveErrorToast" };
