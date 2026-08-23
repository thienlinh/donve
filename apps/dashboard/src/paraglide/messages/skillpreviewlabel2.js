/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillpreviewlabel2Inputs */

const vi_skillpreviewlabel2 =
  /** @type {(inputs: Skillpreviewlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem trước`;
  };

const en_skillpreviewlabel2 =
  /** @type {(inputs: Skillpreviewlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Preview`;
  };

/**
 * | output |
 * | --- |
 * | "Preview" |
 *
 * @param {Skillpreviewlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillpreviewlabel2 =
  /** @type {((inputs?: Skillpreviewlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillpreviewlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillpreviewlabel2(inputs);
      return vi_skillpreviewlabel2(inputs);
    }
  );
export { skillpreviewlabel2 as "skillPreviewLabel" };
