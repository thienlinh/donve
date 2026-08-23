/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentslabreachplaceholder4Inputs */

const vi_leadsassignmentslabreachplaceholder4 =
  /** @type {(inputs: Leadsassignmentslabreachplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `VD: thông báo cho quản lý`;
  };

const en_leadsassignmentslabreachplaceholder4 =
  /** @type {(inputs: Leadsassignmentslabreachplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `E.g. notify the manager`;
  };

/**
 * | output |
 * | --- |
 * | "E.g. notify the manager" |
 *
 * @param {Leadsassignmentslabreachplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentslabreachplaceholder4 =
  /** @type {((inputs?: Leadsassignmentslabreachplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentslabreachplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadsassignmentslabreachplaceholder4(inputs);
      return vi_leadsassignmentslabreachplaceholder4(inputs);
    }
  );
export { leadsassignmentslabreachplaceholder4 as "leadsAssignmentSlaBreachPlaceholder" };
