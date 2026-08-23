/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonall1Inputs */

const vi_commonall1 =
  /** @type {(inputs: Commonall1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tất cả`;
  };

const en_commonall1 =
  /** @type {(inputs: Commonall1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `All`;
  };

/**
 * | output |
 * | --- |
 * | "All" |
 *
 * @param {Commonall1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonall1 =
  /** @type {((inputs?: Commonall1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonall1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonall1(inputs);
      return vi_commonall1(inputs);
    }
  );
export { commonall1 as "commonAll" };
