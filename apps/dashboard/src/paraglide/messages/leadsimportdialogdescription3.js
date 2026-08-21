/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportdialogdescription3Inputs */

const vi_leadsimportdialogdescription3 =
  /** @type {(inputs: Leadsimportdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải lên file .csv, ánh xạ các cột với trường lead, và chọn chiến dịch để gán cho các lead được nhập.`;
  };

const en_leadsimportdialogdescription3 =
  /** @type {(inputs: Leadsimportdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Upload a .csv file, map its columns to lead fields, and choose which campaign to attribute the imported leads to.`;
  };

/**
 * | output |
 * | --- |
 * | "Upload a .csv file, map its columns to lead fields, and choose which campaign to attribute the imported leads to." |
 *
 * @param {Leadsimportdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportdialogdescription3 =
  /** @type {((inputs?: Leadsimportdialogdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportdialogdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportdialogdescription3(inputs);
      return vi_leadsimportdialogdescription3(inputs);
    }
  );
export { leadsimportdialogdescription3 as "leadsImportDialogDescription" };
