/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ created: NonNullable<unknown>, merged: NonNullable<unknown> }} Leadsimportsuccesstoast3Inputs */

const vi_leadsimportsuccesstoast3 =
  /** @type {(inputs: Leadsimportsuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã tạo mới ${i?.created} lead, gộp ${i?.merged} lead vào lead đã có`;
  };

const en_leadsimportsuccesstoast3 =
  /** @type {(inputs: Leadsimportsuccesstoast3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Imported ${i?.created} new lead(s), merged ${i?.merged} into existing leads`;
  };

/**
 * | output |
 * | --- |
 * | "Imported {created} new lead(s), merged {merged} into existing leads" |
 *
 * @param {Leadsimportsuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportsuccesstoast3 =
  /** @type {((inputs: Leadsimportsuccesstoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportsuccesstoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportsuccesstoast3(inputs);
      return vi_leadsimportsuccesstoast3(inputs);
    }
  );
export { leadsimportsuccesstoast3 as "leadsImportSuccessToast" };
