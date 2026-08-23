/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkassignto3Inputs */

const vi_leadsbulkassignto3 =
  /** @type {(inputs: Leadsbulkassignto3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gán cho`;
  };

const en_leadsbulkassignto3 =
  /** @type {(inputs: Leadsbulkassignto3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assign to`;
  };

/**
 * | output |
 * | --- |
 * | "Assign to" |
 *
 * @param {Leadsbulkassignto3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkassignto3 =
  /** @type {((inputs?: Leadsbulkassignto3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkassignto3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkassignto3(inputs);
      return vi_leadsbulkassignto3(inputs);
    }
  );
export { leadsbulkassignto3 as "leadsBulkAssignTo" };
