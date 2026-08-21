/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rows: NonNullable<unknown>, shown: NonNullable<unknown> }} Leadsimportpreviewtitle3Inputs */

const vi_leadsimportpreviewtitle3 =
  /** @type {(inputs: Leadsimportpreviewtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Đã đọc ${i?.rows} dòng — hiển thị ${i?.shown} dòng đầu`;
  };

const en_leadsimportpreviewtitle3 =
  /** @type {(inputs: Leadsimportpreviewtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.rows} rows parsed — showing the first ${i?.shown}`;
  };

/**
 * | output |
 * | --- |
 * | "{rows} rows parsed — showing the first {shown}" |
 *
 * @param {Leadsimportpreviewtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportpreviewtitle3 =
  /** @type {((inputs: Leadsimportpreviewtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportpreviewtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportpreviewtitle3(inputs);
      return vi_leadsimportpreviewtitle3(inputs);
    }
  );
export { leadsimportpreviewtitle3 as "leadsImportPreviewTitle" };
