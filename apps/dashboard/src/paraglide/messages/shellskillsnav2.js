/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellskillsnav2Inputs */

const vi_shellskillsnav2 =
  /** @type {(inputs: Shellskillsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kỹ năng`;
  };

const en_shellskillsnav2 =
  /** @type {(inputs: Shellskillsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Skills`;
  };

/**
 * | output |
 * | --- |
 * | "Skills" |
 *
 * @param {Shellskillsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellskillsnav2 =
  /** @type {((inputs?: Shellskillsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellskillsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellskillsnav2(inputs);
      return vi_shellskillsnav2(inputs);
    }
  );
export { shellskillsnav2 as "shellSkillsNav" };
