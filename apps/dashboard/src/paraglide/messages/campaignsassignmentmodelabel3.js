/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsassignmentmodelabel3Inputs */

const vi_campaignsassignmentmodelabel3 =
  /** @type {(inputs: Campaignsassignmentmodelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gán lead`;
  };

const en_campaignsassignmentmodelabel3 =
  /** @type {(inputs: Campaignsassignmentmodelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lead assignment`;
  };

/**
 * | output |
 * | --- |
 * | "Lead assignment" |
 *
 * @param {Campaignsassignmentmodelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsassignmentmodelabel3 =
  /** @type {((inputs?: Campaignsassignmentmodelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsassignmentmodelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsassignmentmodelabel3(inputs);
      return vi_campaignsassignmentmodelabel3(inputs);
    }
  );
export { campaignsassignmentmodelabel3 as "campaignsAssignmentModeLabel" };
