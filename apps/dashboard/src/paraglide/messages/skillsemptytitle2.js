/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillsemptytitle2Inputs */

const vi_skillsemptytitle2 =
  /** @type {(inputs: Skillsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có kỹ năng nào`;
  };

const en_skillsemptytitle2 =
  /** @type {(inputs: Skillsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No skills yet`;
  };

/**
 * | output |
 * | --- |
 * | "No skills yet" |
 *
 * @param {Skillsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillsemptytitle2 =
  /** @type {((inputs?: Skillsemptytitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillsemptytitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillsemptytitle2(inputs);
      return vi_skillsemptytitle2(inputs);
    }
  );
export { skillsemptytitle2 as "skillsEmptyTitle" };
