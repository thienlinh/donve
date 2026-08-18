/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawtoolrect3Inputs */

const vi_studiodrawtoolrect3 =
  /** @type {(inputs: Studiodrawtoolrect3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khung chữ nhật`;
  };

const en_studiodrawtoolrect3 =
  /** @type {(inputs: Studiodrawtoolrect3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rectangle`;
  };

/**
 * | output |
 * | --- |
 * | "Rectangle" |
 *
 * @param {Studiodrawtoolrect3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawtoolrect3 =
  /** @type {((inputs?: Studiodrawtoolrect3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawtoolrect3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawtoolrect3(inputs);
      return vi_studiodrawtoolrect3(inputs);
    }
  );
export { studiodrawtoolrect3 as "studioDrawToolRect" };
