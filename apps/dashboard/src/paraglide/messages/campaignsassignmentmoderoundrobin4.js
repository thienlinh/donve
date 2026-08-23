/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsassignmentmoderoundrobin4Inputs */

const vi_campaignsassignmentmoderoundrobin4 =
  /** @type {(inputs: Campaignsassignmentmoderoundrobin4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Round-robin (tự động)`;
  };

const en_campaignsassignmentmoderoundrobin4 =
  /** @type {(inputs: Campaignsassignmentmoderoundrobin4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Round-robin (auto)`;
  };

/**
 * | output |
 * | --- |
 * | "Round-robin (auto)" |
 *
 * @param {Campaignsassignmentmoderoundrobin4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsassignmentmoderoundrobin4 =
  /** @type {((inputs?: Campaignsassignmentmoderoundrobin4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsassignmentmoderoundrobin4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsassignmentmoderoundrobin4(inputs);
      return vi_campaignsassignmentmoderoundrobin4(inputs);
    }
  );
export { campaignsassignmentmoderoundrobin4 as "campaignsAssignmentModeRoundRobin" };
