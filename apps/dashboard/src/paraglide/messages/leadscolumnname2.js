/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscolumnname2Inputs */

const vi_leadscolumnname2 =
  /** @type {(inputs: Leadscolumnname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên`;
  };

const en_leadscolumnname2 =
  /** @type {(inputs: Leadscolumnname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name`;
  };

/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Leadscolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscolumnname2 =
  /** @type {((inputs?: Leadscolumnname2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscolumnname2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscolumnname2(inputs);
      return vi_leadscolumnname2(inputs);
    }
  );
export { leadscolumnname2 as "leadsColumnName" };
