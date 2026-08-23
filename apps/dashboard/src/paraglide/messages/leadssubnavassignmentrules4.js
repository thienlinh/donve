/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssubnavassignmentrules4Inputs */

const vi_leadssubnavassignmentrules4 =
  /** @type {(inputs: Leadssubnavassignmentrules4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quy tắc gán lead`;
  };

const en_leadssubnavassignmentrules4 =
  /** @type {(inputs: Leadssubnavassignmentrules4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assignment rules`;
  };

/**
 * | output |
 * | --- |
 * | "Assignment rules" |
 *
 * @param {Leadssubnavassignmentrules4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssubnavassignmentrules4 =
  /** @type {((inputs?: Leadssubnavassignmentrules4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssubnavassignmentrules4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssubnavassignmentrules4(inputs);
      return vi_leadssubnavassignmentrules4(inputs);
    }
  );
export { leadssubnavassignmentrules4 as "leadsSubNavAssignmentRules" };
