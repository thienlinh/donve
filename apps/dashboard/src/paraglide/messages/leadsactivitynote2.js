/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivitynote2Inputs */

const vi_leadsactivitynote2 =
  /** @type {(inputs: Leadsactivitynote2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi chú`;
  };

const en_leadsactivitynote2 =
  /** @type {(inputs: Leadsactivitynote2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Note`;
  };

/**
 * | output |
 * | --- |
 * | "Note" |
 *
 * @param {Leadsactivitynote2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivitynote2 =
  /** @type {((inputs?: Leadsactivitynote2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivitynote2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivitynote2(inputs);
      return vi_leadsactivitynote2(inputs);
    }
  );
export { leadsactivitynote2 as "leadsActivityNote" };
