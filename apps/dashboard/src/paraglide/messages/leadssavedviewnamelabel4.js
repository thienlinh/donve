/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewnamelabel4Inputs */

const vi_leadssavedviewnamelabel4 =
  /** @type {(inputs: Leadssavedviewnamelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên bộ lọc`;
  };

const en_leadssavedviewnamelabel4 =
  /** @type {(inputs: Leadssavedviewnamelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `View name`;
  };

/**
 * | output |
 * | --- |
 * | "View name" |
 *
 * @param {Leadssavedviewnamelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewnamelabel4 =
  /** @type {((inputs?: Leadssavedviewnamelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewnamelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewnamelabel4(inputs);
      return vi_leadssavedviewnamelabel4(inputs);
    }
  );
export { leadssavedviewnamelabel4 as "leadsSavedViewNameLabel" };
