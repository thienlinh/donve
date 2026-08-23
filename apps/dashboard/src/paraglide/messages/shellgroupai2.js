/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellgroupai2Inputs */

const vi_shellgroupai2 =
  /** @type {(inputs: Shellgroupai2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI`;
  };

const en_shellgroupai2 =
  /** @type {(inputs: Shellgroupai2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI`;
  };

/**
 * | output |
 * | --- |
 * | "AI" |
 *
 * @param {Shellgroupai2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellgroupai2 =
  /** @type {((inputs?: Shellgroupai2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellgroupai2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellgroupai2(inputs);
      return vi_shellgroupai2(inputs);
    }
  );
export { shellgroupai2 as "shellGroupAi" };
