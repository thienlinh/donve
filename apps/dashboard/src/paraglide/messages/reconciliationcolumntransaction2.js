/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationcolumntransaction2Inputs */

const vi_reconciliationcolumntransaction2 =
  /** @type {(inputs: Reconciliationcolumntransaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giao dịch`;
  };

const en_reconciliationcolumntransaction2 =
  /** @type {(inputs: Reconciliationcolumntransaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Transaction`;
  };

/**
 * | output |
 * | --- |
 * | "Transaction" |
 *
 * @param {Reconciliationcolumntransaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationcolumntransaction2 =
  /** @type {((inputs?: Reconciliationcolumntransaction2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationcolumntransaction2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationcolumntransaction2(inputs);
      return vi_reconciliationcolumntransaction2(inputs);
    }
  );
export { reconciliationcolumntransaction2 as "reconciliationColumnTransaction" };
