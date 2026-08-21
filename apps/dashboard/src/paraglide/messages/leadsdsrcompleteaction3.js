/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrcompleteaction3Inputs */

const vi_leadsdsrcompleteaction3 =
  /** @type {(inputs: Leadsdsrcompleteaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đánh dấu đã xử lý`;
  };

const en_leadsdsrcompleteaction3 =
  /** @type {(inputs: Leadsdsrcompleteaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mark handled`;
  };

/**
 * | output |
 * | --- |
 * | "Mark handled" |
 *
 * @param {Leadsdsrcompleteaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrcompleteaction3 =
  /** @type {((inputs?: Leadsdsrcompleteaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrcompleteaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrcompleteaction3(inputs);
      return vi_leadsdsrcompleteaction3(inputs);
    }
  );
export { leadsdsrcompleteaction3 as "leadsDsrCompleteAction" };
