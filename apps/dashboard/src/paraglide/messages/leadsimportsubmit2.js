/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportsubmit2Inputs */

const vi_leadsimportsubmit2 =
  /** @type {(inputs: Leadsimportsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhập`;
  };

const en_leadsimportsubmit2 =
  /** @type {(inputs: Leadsimportsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import`;
  };

/**
 * | output |
 * | --- |
 * | "Import" |
 *
 * @param {Leadsimportsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportsubmit2 =
  /** @type {((inputs?: Leadsimportsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportsubmit2(inputs);
      return vi_leadsimportsubmit2(inputs);
    }
  );
export { leadsimportsubmit2 as "leadsImportSubmit" };
