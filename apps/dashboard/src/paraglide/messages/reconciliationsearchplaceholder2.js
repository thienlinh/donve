/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationsearchplaceholder2Inputs */

const vi_reconciliationsearchplaceholder2 =
  /** @type {(inputs: Reconciliationsearchplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tìm theo mã đơn hoặc số điện thoại`;
  };

const en_reconciliationsearchplaceholder2 =
  /** @type {(inputs: Reconciliationsearchplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Search by order code or phone`;
  };

/**
 * | output |
 * | --- |
 * | "Search by order code or phone" |
 *
 * @param {Reconciliationsearchplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationsearchplaceholder2 =
  /** @type {((inputs?: Reconciliationsearchplaceholder2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationsearchplaceholder2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationsearchplaceholder2(inputs);
      return vi_reconciliationsearchplaceholder2(inputs);
    }
  );
export { reconciliationsearchplaceholder2 as "reconciliationSearchPlaceholder" };
