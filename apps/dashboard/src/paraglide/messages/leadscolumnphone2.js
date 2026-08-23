/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscolumnphone2Inputs */

const vi_leadscolumnphone2 =
  /** @type {(inputs: Leadscolumnphone2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SĐT`;
  };

const en_leadscolumnphone2 =
  /** @type {(inputs: Leadscolumnphone2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Phone`;
  };

/**
 * | output |
 * | --- |
 * | "Phone" |
 *
 * @param {Leadscolumnphone2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscolumnphone2 =
  /** @type {((inputs?: Leadscolumnphone2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscolumnphone2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscolumnphone2(inputs);
      return vi_leadscolumnphone2(inputs);
    }
  );
export { leadscolumnphone2 as "leadsColumnPhone" };
