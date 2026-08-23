/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcolumndefault2Inputs */

const vi_skillcolumndefault2 =
  /** @type {(inputs: Skillcolumndefault2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mặc định`;
  };

const en_skillcolumndefault2 =
  /** @type {(inputs: Skillcolumndefault2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Default`;
  };

/**
 * | output |
 * | --- |
 * | "Default" |
 *
 * @param {Skillcolumndefault2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcolumndefault2 =
  /** @type {((inputs?: Skillcolumndefault2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcolumndefault2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcolumndefault2(inputs);
      return vi_skillcolumndefault2(inputs);
    }
  );
export { skillcolumndefault2 as "skillColumnDefault" };
