/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsaddnoteplaceholder3Inputs */

const vi_leadsaddnoteplaceholder3 =
  /** @type {(inputs: Leadsaddnoteplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi chú về lead này...`;
  };

const en_leadsaddnoteplaceholder3 =
  /** @type {(inputs: Leadsaddnoteplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Write a note about this lead...`;
  };

/**
 * | output |
 * | --- |
 * | "Write a note about this lead..." |
 *
 * @param {Leadsaddnoteplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsaddnoteplaceholder3 =
  /** @type {((inputs?: Leadsaddnoteplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsaddnoteplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsaddnoteplaceholder3(inputs);
      return vi_leadsaddnoteplaceholder3(inputs);
    }
  );
export { leadsaddnoteplaceholder3 as "leadsAddNotePlaceholder" };
