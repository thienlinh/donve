/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmenteditrule3Inputs */

const vi_leadsassignmenteditrule3 =
  /** @type {(inputs: Leadsassignmenteditrule3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sửa rule`;
  };

const en_leadsassignmenteditrule3 =
  /** @type {(inputs: Leadsassignmenteditrule3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit rule`;
  };

/**
 * | output |
 * | --- |
 * | "Edit rule" |
 *
 * @param {Leadsassignmenteditrule3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmenteditrule3 =
  /** @type {((inputs?: Leadsassignmenteditrule3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmenteditrule3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmenteditrule3(inputs);
      return vi_leadsassignmenteditrule3(inputs);
    }
  );
export { leadsassignmenteditrule3 as "leadsAssignmentEditRule" };
