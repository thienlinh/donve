/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportdialogtitle3Inputs */

const vi_leadsimportdialogtitle3 =
  /** @type {(inputs: Leadsimportdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhập lead từ CSV`;
  };

const en_leadsimportdialogtitle3 =
  /** @type {(inputs: Leadsimportdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import leads from CSV`;
  };

/**
 * | output |
 * | --- |
 * | "Import leads from CSV" |
 *
 * @param {Leadsimportdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportdialogtitle3 =
  /** @type {((inputs?: Leadsimportdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportdialogtitle3(inputs);
      return vi_leadsimportdialogtitle3(inputs);
    }
  );
export { leadsimportdialogtitle3 as "leadsImportDialogTitle" };
