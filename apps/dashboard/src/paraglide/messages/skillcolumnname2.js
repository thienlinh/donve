/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcolumnname2Inputs */

const vi_skillcolumnname2 =
  /** @type {(inputs: Skillcolumnname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên`;
  };

const en_skillcolumnname2 =
  /** @type {(inputs: Skillcolumnname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name`;
  };

/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Skillcolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcolumnname2 =
  /** @type {((inputs?: Skillcolumnname2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcolumnname2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcolumnname2(inputs);
      return vi_skillcolumnname2(inputs);
    }
  );
export { skillcolumnname2 as "skillColumnName" };
