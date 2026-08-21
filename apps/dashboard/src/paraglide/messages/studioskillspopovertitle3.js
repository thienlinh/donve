/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioskillspopovertitle3Inputs */

const vi_studioskillspopovertitle3 =
  /** @type {(inputs: Studioskillspopovertitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kỹ năng cho trang này`;
  };

const en_studioskillspopovertitle3 =
  /** @type {(inputs: Studioskillspopovertitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Skills for this page`;
  };

/**
 * | output |
 * | --- |
 * | "Skills for this page" |
 *
 * @param {Studioskillspopovertitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioskillspopovertitle3 =
  /** @type {((inputs?: Studioskillspopovertitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioskillspopovertitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioskillspopovertitle3(inputs);
      return vi_studioskillspopovertitle3(inputs);
    }
  );
export { studioskillspopovertitle3 as "studioSkillsPopoverTitle" };
