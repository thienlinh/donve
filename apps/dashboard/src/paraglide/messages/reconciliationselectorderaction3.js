/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationselectorderaction3Inputs */

const vi_reconciliationselectorderaction3 =
  /** @type {(inputs: Reconciliationselectorderaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gán vào đơn này`;
  };

const en_reconciliationselectorderaction3 =
  /** @type {(inputs: Reconciliationselectorderaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assign to this order`;
  };

/**
 * | output |
 * | --- |
 * | "Assign to this order" |
 *
 * @param {Reconciliationselectorderaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationselectorderaction3 =
  /** @type {((inputs?: Reconciliationselectorderaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationselectorderaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationselectorderaction3(inputs);
      return vi_reconciliationselectorderaction3(inputs);
    }
  );
export { reconciliationselectorderaction3 as "reconciliationSelectOrderAction" };
