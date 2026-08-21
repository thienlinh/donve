/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcolumnactions2Inputs */

const vi_skillcolumnactions2 =
  /** @type {(inputs: Skillcolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thao tác`;
  };

const en_skillcolumnactions2 =
  /** @type {(inputs: Skillcolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Skillcolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcolumnactions2 =
  /** @type {((inputs?: Skillcolumnactions2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcolumnactions2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcolumnactions2(inputs);
      return vi_skillcolumnactions2(inputs);
    }
  );
export { skillcolumnactions2 as "skillColumnActions" };
