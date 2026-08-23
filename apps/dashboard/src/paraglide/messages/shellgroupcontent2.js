/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellgroupcontent2Inputs */

const vi_shellgroupcontent2 =
  /** @type {(inputs: Shellgroupcontent2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nội dung`;
  };

const en_shellgroupcontent2 =
  /** @type {(inputs: Shellgroupcontent2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Content`;
  };

/**
 * | output |
 * | --- |
 * | "Content" |
 *
 * @param {Shellgroupcontent2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellgroupcontent2 =
  /** @type {((inputs?: Shellgroupcontent2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellgroupcontent2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellgroupcontent2(inputs);
      return vi_shellgroupcontent2(inputs);
    }
  );
export { shellgroupcontent2 as "shellGroupContent" };
