/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsaddnotesubmit3Inputs */

const vi_leadsaddnotesubmit3 =
  /** @type {(inputs: Leadsaddnotesubmit3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm ghi chú`;
  };

const en_leadsaddnotesubmit3 =
  /** @type {(inputs: Leadsaddnotesubmit3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add note`;
  };

/**
 * | output |
 * | --- |
 * | "Add note" |
 *
 * @param {Leadsaddnotesubmit3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsaddnotesubmit3 =
  /** @type {((inputs?: Leadsaddnotesubmit3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsaddnotesubmit3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsaddnotesubmit3(inputs);
      return vi_leadsaddnotesubmit3(inputs);
    }
  );
export { leadsaddnotesubmit3 as "leadsAddNoteSubmit" };
