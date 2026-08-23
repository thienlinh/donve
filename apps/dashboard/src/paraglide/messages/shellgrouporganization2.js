/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellgrouporganization2Inputs */

const vi_shellgrouporganization2 =
  /** @type {(inputs: Shellgrouporganization2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tổ chức`;
  };

const en_shellgrouporganization2 =
  /** @type {(inputs: Shellgrouporganization2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Organization`;
  };

/**
 * | output |
 * | --- |
 * | "Organization" |
 *
 * @param {Shellgrouporganization2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellgrouporganization2 =
  /** @type {((inputs?: Shellgrouporganization2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellgrouporganization2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellgrouporganization2(inputs);
      return vi_shellgrouporganization2(inputs);
    }
  );
export { shellgrouporganization2 as "shellGroupOrganization" };
