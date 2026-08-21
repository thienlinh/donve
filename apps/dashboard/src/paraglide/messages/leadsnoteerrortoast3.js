/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnoteerrortoast3Inputs */

const vi_leadsnoteerrortoast3 =
  /** @type {(inputs: Leadsnoteerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được ghi chú. Thử lại.`;
  };

const en_leadsnoteerrortoast3 =
  /** @type {(inputs: Leadsnoteerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this note. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this note. Try again." |
 *
 * @param {Leadsnoteerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnoteerrortoast3 =
  /** @type {((inputs?: Leadsnoteerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnoteerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnoteerrortoast3(inputs);
      return vi_leadsnoteerrortoast3(inputs);
    }
  );
export { leadsnoteerrortoast3 as "leadsNoteErrorToast" };
