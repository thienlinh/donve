/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawclear2Inputs */

const vi_studiodrawclear2 =
  /** @type {(inputs: Studiodrawclear2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá tất cả`;
  };

const en_studiodrawclear2 =
  /** @type {(inputs: Studiodrawclear2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Clear all`;
  };

/**
 * | output |
 * | --- |
 * | "Clear all" |
 *
 * @param {Studiodrawclear2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawclear2 =
  /** @type {((inputs?: Studiodrawclear2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawclear2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawclear2(inputs);
      return vi_studiodrawclear2(inputs);
    }
  );
export { studiodrawclear2 as "studioDrawClear" };
