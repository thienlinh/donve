/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscolumnstage2Inputs */

const vi_leadscolumnstage2 =
  /** @type {(inputs: Leadscolumnstage2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_leadscolumnstage2 =
  /** @type {(inputs: Leadscolumnstage2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Stage`;
  };

/**
 * | output |
 * | --- |
 * | "Stage" |
 *
 * @param {Leadscolumnstage2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscolumnstage2 =
  /** @type {((inputs?: Leadscolumnstage2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscolumnstage2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscolumnstage2(inputs);
      return vi_leadscolumnstage2(inputs);
    }
  );
export { leadscolumnstage2 as "leadsColumnStage" };
