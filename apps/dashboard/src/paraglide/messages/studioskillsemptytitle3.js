/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioskillsemptytitle3Inputs */

const vi_studioskillsemptytitle3 =
  /** @type {(inputs: Studioskillsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có kỹ năng nào`;
  };

const en_studioskillsemptytitle3 =
  /** @type {(inputs: Studioskillsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No skills yet`;
  };

/**
 * | output |
 * | --- |
 * | "No skills yet" |
 *
 * @param {Studioskillsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioskillsemptytitle3 =
  /** @type {((inputs?: Studioskillsemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioskillsemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioskillsemptytitle3(inputs);
      return vi_studioskillsemptytitle3(inputs);
    }
  );
export { studioskillsemptytitle3 as "studioSkillsEmptyTitle" };
