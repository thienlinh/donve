/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawtoolpen3Inputs */

const vi_studiodrawtoolpen3 =
  /** @type {(inputs: Studiodrawtoolpen3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bút`;
  };

const en_studiodrawtoolpen3 =
  /** @type {(inputs: Studiodrawtoolpen3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pen`;
  };

/**
 * | output |
 * | --- |
 * | "Pen" |
 *
 * @param {Studiodrawtoolpen3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawtoolpen3 =
  /** @type {((inputs?: Studiodrawtoolpen3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawtoolpen3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawtoolpen3(inputs);
      return vi_studiodrawtoolpen3(inputs);
    }
  );
export { studiodrawtoolpen3 as "studioDrawToolPen" };
