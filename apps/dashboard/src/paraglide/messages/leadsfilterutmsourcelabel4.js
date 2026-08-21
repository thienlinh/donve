/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterutmsourcelabel4Inputs */

const vi_leadsfilterutmsourcelabel4 =
  /** @type {(inputs: Leadsfilterutmsourcelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nguồn UTM`;
  };

const en_leadsfilterutmsourcelabel4 =
  /** @type {(inputs: Leadsfilterutmsourcelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `UTM source`;
  };

/**
 * | output |
 * | --- |
 * | "UTM source" |
 *
 * @param {Leadsfilterutmsourcelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterutmsourcelabel4 =
  /** @type {((inputs?: Leadsfilterutmsourcelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterutmsourcelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterutmsourcelabel4(inputs);
      return vi_leadsfilterutmsourcelabel4(inputs);
    }
  );
export { leadsfilterutmsourcelabel4 as "leadsFilterUtmSourceLabel" };
