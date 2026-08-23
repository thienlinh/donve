/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillstitle1Inputs */

const vi_skillstitle1 =
  /** @type {(inputs: Skillstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kỹ năng`;
  };

const en_skillstitle1 =
  /** @type {(inputs: Skillstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Skills`;
  };

/**
 * | output |
 * | --- |
 * | "Skills" |
 *
 * @param {Skillstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillstitle1 =
  /** @type {((inputs?: Skillstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillstitle1(inputs);
      return vi_skillstitle1(inputs);
    }
  );
export { skillstitle1 as "skillsTitle" };
