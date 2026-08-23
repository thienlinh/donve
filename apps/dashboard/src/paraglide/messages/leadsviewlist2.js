/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsviewlist2Inputs */

const vi_leadsviewlist2 =
  /** @type {(inputs: Leadsviewlist2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Danh sách`;
  };

const en_leadsviewlist2 =
  /** @type {(inputs: Leadsviewlist2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `List`;
  };

/**
 * | output |
 * | --- |
 * | "List" |
 *
 * @param {Leadsviewlist2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsviewlist2 =
  /** @type {((inputs?: Leadsviewlist2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsviewlist2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsviewlist2(inputs);
      return vi_leadsviewlist2(inputs);
    }
  );
export { leadsviewlist2 as "leadsViewList" };
