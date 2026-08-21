/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportnorowserror4Inputs */

const vi_leadsimportnorowserror4 =
  /** @type {(inputs: Leadsimportnorowserror4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có dòng nào có đủ tên và số điện thoại — không có gì để nhập.`;
  };

const en_leadsimportnorowserror4 =
  /** @type {(inputs: Leadsimportnorowserror4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No rows have both a name and a phone mapped — nothing to import.`;
  };

/**
 * | output |
 * | --- |
 * | "No rows have both a name and a phone mapped — nothing to import." |
 *
 * @param {Leadsimportnorowserror4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportnorowserror4 =
  /** @type {((inputs?: Leadsimportnorowserror4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportnorowserror4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportnorowserror4(inputs);
      return vi_leadsimportnorowserror4(inputs);
    }
  );
export { leadsimportnorowserror4 as "leadsImportNoRowsError" };
