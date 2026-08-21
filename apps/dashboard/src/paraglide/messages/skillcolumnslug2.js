/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcolumnslug2Inputs */

const vi_skillcolumnslug2 =
  /** @type {(inputs: Skillcolumnslug2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

const en_skillcolumnslug2 =
  /** @type {(inputs: Skillcolumnslug2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Skillcolumnslug2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcolumnslug2 =
  /** @type {((inputs?: Skillcolumnslug2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcolumnslug2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcolumnslug2(inputs);
      return vi_skillcolumnslug2(inputs);
    }
  );
export { skillcolumnslug2 as "skillColumnSlug" };
