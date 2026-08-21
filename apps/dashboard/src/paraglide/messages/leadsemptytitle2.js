/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsemptytitle2Inputs */

const vi_leadsemptytitle2 =
  /** @type {(inputs: Leadsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có lead nào khớp bộ lọc`;
  };

const en_leadsemptytitle2 =
  /** @type {(inputs: Leadsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No leads match these filters`;
  };

/**
 * | output |
 * | --- |
 * | "No leads match these filters" |
 *
 * @param {Leadsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsemptytitle2 =
  /** @type {((inputs?: Leadsemptytitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsemptytitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsemptytitle2(inputs);
      return vi_leadsemptytitle2(inputs);
    }
  );
export { leadsemptytitle2 as "leadsEmptyTitle" };
