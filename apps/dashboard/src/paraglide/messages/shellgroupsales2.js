/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellgroupsales2Inputs */

const vi_shellgroupsales2 =
  /** @type {(inputs: Shellgroupsales2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kinh doanh`;
  };

const en_shellgroupsales2 =
  /** @type {(inputs: Shellgroupsales2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sales`;
  };

/**
 * | output |
 * | --- |
 * | "Sales" |
 *
 * @param {Shellgroupsales2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellgroupsales2 =
  /** @type {((inputs?: Shellgroupsales2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellgroupsales2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellgroupsales2(inputs);
      return vi_shellgroupsales2(inputs);
    }
  );
export { shellgroupsales2 as "shellGroupSales" };
