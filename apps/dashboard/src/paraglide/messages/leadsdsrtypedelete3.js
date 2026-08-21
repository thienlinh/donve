/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrtypedelete3Inputs */

const vi_leadsdsrtypedelete3 =
  /** @type {(inputs: Leadsdsrtypedelete3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá dữ liệu`;
  };

const en_leadsdsrtypedelete3 =
  /** @type {(inputs: Leadsdsrtypedelete3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete`;
  };

/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Leadsdsrtypedelete3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrtypedelete3 =
  /** @type {((inputs?: Leadsdsrtypedelete3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrtypedelete3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrtypedelete3(inputs);
      return vi_leadsdsrtypedelete3(inputs);
    }
  );
export { leadsdsrtypedelete3 as "leadsDsrTypeDelete" };
