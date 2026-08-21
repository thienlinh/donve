/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioskillsbutton2Inputs */

const vi_studioskillsbutton2 =
  /** @type {(inputs: Studioskillsbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kỹ năng cho trang này`;
  };

const en_studioskillsbutton2 =
  /** @type {(inputs: Studioskillsbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Skills for this page`;
  };

/**
 * | output |
 * | --- |
 * | "Skills for this page" |
 *
 * @param {Studioskillsbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioskillsbutton2 =
  /** @type {((inputs?: Studioskillsbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioskillsbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioskillsbutton2(inputs);
      return vi_studioskillsbutton2(inputs);
    }
  );
export { studioskillsbutton2 as "studioSkillsButton" };
