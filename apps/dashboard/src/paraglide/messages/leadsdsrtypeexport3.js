/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrtypeexport3Inputs */

const vi_leadsdsrtypeexport3 =
  /** @type {(inputs: Leadsdsrtypeexport3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất dữ liệu`;
  };

const en_leadsdsrtypeexport3 =
  /** @type {(inputs: Leadsdsrtypeexport3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Export`;
  };

/**
 * | output |
 * | --- |
 * | "Export" |
 *
 * @param {Leadsdsrtypeexport3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrtypeexport3 =
  /** @type {((inputs?: Leadsdsrtypeexport3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrtypeexport3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrtypeexport3(inputs);
      return vi_leadsdsrtypeexport3(inputs);
    }
  );
export { leadsdsrtypeexport3 as "leadsDsrTypeExport" };
