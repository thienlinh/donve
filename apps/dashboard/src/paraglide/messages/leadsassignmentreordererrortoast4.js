/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentreordererrortoast4Inputs */

const vi_leadsassignmentreordererrortoast4 =
  /** @type {(inputs: Leadsassignmentreordererrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được thứ tự ưu tiên. Thử lại.`;
  };

const en_leadsassignmentreordererrortoast4 =
  /** @type {(inputs: Leadsassignmentreordererrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save the new priority order. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save the new priority order. Try again." |
 *
 * @param {Leadsassignmentreordererrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentreordererrortoast4 =
  /** @type {((inputs?: Leadsassignmentreordererrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentreordererrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentreordererrortoast4(inputs);
      return vi_leadsassignmentreordererrortoast4(inputs);
    }
  );
export { leadsassignmentreordererrortoast4 as "leadsAssignmentReorderErrorToast" };
