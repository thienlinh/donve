/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationcolumnreason2Inputs */

const vi_reconciliationcolumnreason2 =
  /** @type {(inputs: Reconciliationcolumnreason2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lý do`;
  };

const en_reconciliationcolumnreason2 =
  /** @type {(inputs: Reconciliationcolumnreason2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reason`;
  };

/**
 * | output |
 * | --- |
 * | "Reason" |
 *
 * @param {Reconciliationcolumnreason2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationcolumnreason2 =
  /** @type {((inputs?: Reconciliationcolumnreason2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationcolumnreason2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationcolumnreason2(inputs);
      return vi_reconciliationcolumnreason2(inputs);
    }
  );
export { reconciliationcolumnreason2 as "reconciliationColumnReason" };
