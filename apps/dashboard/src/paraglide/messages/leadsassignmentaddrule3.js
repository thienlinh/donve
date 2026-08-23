/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentaddrule3Inputs */

const vi_leadsassignmentaddrule3 =
  /** @type {(inputs: Leadsassignmentaddrule3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `+ Thêm rule`;
  };

const en_leadsassignmentaddrule3 =
  /** @type {(inputs: Leadsassignmentaddrule3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `+ Add rule`;
  };

/**
 * | output |
 * | --- |
 * | "+ Add rule" |
 *
 * @param {Leadsassignmentaddrule3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentaddrule3 =
  /** @type {((inputs?: Leadsassignmentaddrule3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentaddrule3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentaddrule3(inputs);
      return vi_leadsassignmentaddrule3(inputs);
    }
  );
export { leadsassignmentaddrule3 as "leadsAssignmentAddRule" };
