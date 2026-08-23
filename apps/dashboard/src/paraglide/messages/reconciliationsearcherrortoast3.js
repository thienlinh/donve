/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationsearcherrortoast3Inputs */

const vi_reconciliationsearcherrortoast3 =
  /** @type {(inputs: Reconciliationsearcherrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tìm kiếm đơn hàng thất bại. Vui lòng thử lại.`;
  };

const en_reconciliationsearcherrortoast3 =
  /** @type {(inputs: Reconciliationsearcherrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Order search failed. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Order search failed. Try again." |
 *
 * @param {Reconciliationsearcherrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationsearcherrortoast3 =
  /** @type {((inputs?: Reconciliationsearcherrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationsearcherrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationsearcherrortoast3(inputs);
      return vi_reconciliationsearcherrortoast3(inputs);
    }
  );
export { reconciliationsearcherrortoast3 as "reconciliationSearchErrorToast" };
