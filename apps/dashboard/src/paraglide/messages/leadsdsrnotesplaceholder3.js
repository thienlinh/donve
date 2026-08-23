/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrnotesplaceholder3Inputs */

const vi_leadsdsrnotesplaceholder3 =
  /** @type {(inputs: Leadsdsrnotesplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi chú thêm (không bắt buộc)...`;
  };

const en_leadsdsrnotesplaceholder3 =
  /** @type {(inputs: Leadsdsrnotesplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Optional notes...`;
  };

/**
 * | output |
 * | --- |
 * | "Optional notes..." |
 *
 * @param {Leadsdsrnotesplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrnotesplaceholder3 =
  /** @type {((inputs?: Leadsdsrnotesplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrnotesplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrnotesplaceholder3(inputs);
      return vi_leadsdsrnotesplaceholder3(inputs);
    }
  );
export { leadsdsrnotesplaceholder3 as "leadsDsrNotesPlaceholder" };
