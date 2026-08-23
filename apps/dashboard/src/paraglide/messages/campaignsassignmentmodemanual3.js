/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsassignmentmodemanual3Inputs */

const vi_campaignsassignmentmodemanual3 =
  /** @type {(inputs: Campaignsassignmentmodemanual3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thủ công`;
  };

const en_campaignsassignmentmodemanual3 =
  /** @type {(inputs: Campaignsassignmentmodemanual3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manual`;
  };

/**
 * | output |
 * | --- |
 * | "Manual" |
 *
 * @param {Campaignsassignmentmodemanual3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsassignmentmodemanual3 =
  /** @type {((inputs?: Campaignsassignmentmodemanual3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsassignmentmodemanual3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsassignmentmodemanual3(inputs);
      return vi_campaignsassignmentmodemanual3(inputs);
    }
  );
export { campaignsassignmentmodemanual3 as "campaignsAssignmentModeManual" };
