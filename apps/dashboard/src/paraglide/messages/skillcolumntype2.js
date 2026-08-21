/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcolumntype2Inputs */

const vi_skillcolumntype2 =
  /** @type {(inputs: Skillcolumntype2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Loại`;
  };

const en_skillcolumntype2 =
  /** @type {(inputs: Skillcolumntype2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Type`;
  };

/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Skillcolumntype2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcolumntype2 =
  /** @type {((inputs?: Skillcolumntype2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcolumntype2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcolumntype2(inputs);
      return vi_skillcolumntype2(inputs);
    }
  );
export { skillcolumntype2 as "skillColumnType" };
