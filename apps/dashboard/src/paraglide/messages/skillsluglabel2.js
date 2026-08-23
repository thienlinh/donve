/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillsluglabel2Inputs */

const vi_skillsluglabel2 =
  /** @type {(inputs: Skillsluglabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

const en_skillsluglabel2 =
  /** @type {(inputs: Skillsluglabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Skillsluglabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillsluglabel2 =
  /** @type {((inputs?: Skillsluglabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillsluglabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillsluglabel2(inputs);
      return vi_skillsluglabel2(inputs);
    }
  );
export { skillsluglabel2 as "skillSlugLabel" };
