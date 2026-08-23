/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skilltypetenant2Inputs */

const vi_skilltypetenant2 =
  /** @type {(inputs: Skilltypetenant2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tùy chỉnh`;
  };

const en_skilltypetenant2 =
  /** @type {(inputs: Skilltypetenant2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Custom`;
  };

/**
 * | output |
 * | --- |
 * | "Custom" |
 *
 * @param {Skilltypetenant2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skilltypetenant2 =
  /** @type {((inputs?: Skilltypetenant2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skilltypetenant2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skilltypetenant2(inputs);
      return vi_skilltypetenant2(inputs);
    }
  );
export { skilltypetenant2 as "skillTypeTenant" };
