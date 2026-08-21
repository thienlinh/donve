/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Leadsimportskippedrowstoast4Inputs */

const vi_leadsimportskippedrowstoast4 =
  /** @type {(inputs: Leadsimportskippedrowstoast4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã bỏ qua ${i?.count} dòng thiếu tên hoặc số điện thoại`;
  };

const en_leadsimportskippedrowstoast4 =
  /** @type {(inputs: Leadsimportskippedrowstoast4Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Skipped ${i?.count} row(s) missing a name or phone`;
  };

/**
 * | output |
 * | --- |
 * | "Skipped {count} row(s) missing a name or phone" |
 *
 * @param {Leadsimportskippedrowstoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportskippedrowstoast4 =
  /** @type {((inputs: Leadsimportskippedrowstoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportskippedrowstoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportskippedrowstoast4(inputs);
      return vi_leadsimportskippedrowstoast4(inputs);
    }
  );
export { leadsimportskippedrowstoast4 as "leadsImportSkippedRowsToast" };
