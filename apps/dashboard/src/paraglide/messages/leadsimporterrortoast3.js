/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimporterrortoast3Inputs */

const vi_leadsimporterrortoast3 =
  /** @type {(inputs: Leadsimporterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không nhập được file này. Thử lại.`;
  };

const en_leadsimporterrortoast3 =
  /** @type {(inputs: Leadsimporterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't import this file. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't import this file. Try again." |
 *
 * @param {Leadsimporterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimporterrortoast3 =
  /** @type {((inputs?: Leadsimporterrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimporterrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimporterrortoast3(inputs);
      return vi_leadsimporterrortoast3(inputs);
    }
  );
export { leadsimporterrortoast3 as "leadsImportErrorToast" };
