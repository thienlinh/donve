/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssubnavoverview3Inputs */

const vi_leadssubnavoverview3 =
  /** @type {(inputs: Leadssubnavoverview3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tổng quan`;
  };

const en_leadssubnavoverview3 =
  /** @type {(inputs: Leadssubnavoverview3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Overview`;
  };

/**
 * | output |
 * | --- |
 * | "Overview" |
 *
 * @param {Leadssubnavoverview3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssubnavoverview3 =
  /** @type {((inputs?: Leadssubnavoverview3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssubnavoverview3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssubnavoverview3(inputs);
      return vi_leadssubnavoverview3(inputs);
    }
  );
export { leadssubnavoverview3 as "leadsSubNavOverview" };
