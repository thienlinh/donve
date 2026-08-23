/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationcolumnamount2Inputs */

const vi_reconciliationcolumnamount2 =
  /** @type {(inputs: Reconciliationcolumnamount2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số tiền`;
  };

const en_reconciliationcolumnamount2 =
  /** @type {(inputs: Reconciliationcolumnamount2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Amount`;
  };

/**
 * | output |
 * | --- |
 * | "Amount" |
 *
 * @param {Reconciliationcolumnamount2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationcolumnamount2 =
  /** @type {((inputs?: Reconciliationcolumnamount2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationcolumnamount2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationcolumnamount2(inputs);
      return vi_reconciliationcolumnamount2(inputs);
    }
  );
export { reconciliationcolumnamount2 as "reconciliationColumnAmount" };
