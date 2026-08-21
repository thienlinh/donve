/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivitystagechange3Inputs */

const vi_leadsactivitystagechange3 =
  /** @type {(inputs: Leadsactivitystagechange3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đổi trạng thái`;
  };

const en_leadsactivitystagechange3 =
  /** @type {(inputs: Leadsactivitystagechange3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Stage changed`;
  };

/**
 * | output |
 * | --- |
 * | "Stage changed" |
 *
 * @param {Leadsactivitystagechange3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivitystagechange3 =
  /** @type {((inputs?: Leadsactivitystagechange3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivitystagechange3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivitystagechange3(inputs);
      return vi_leadsactivitystagechange3(inputs);
    }
  );
export { leadsactivitystagechange3 as "leadsActivityStageChange" };
