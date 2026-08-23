/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationreasonnocandidate3Inputs */

const vi_reconciliationreasonnocandidate3 =
  /** @type {(inputs: Reconciliationreasonnocandidate3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có đơn khớp`;
  };

const en_reconciliationreasonnocandidate3 =
  /** @type {(inputs: Reconciliationreasonnocandidate3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No matching order`;
  };

/**
 * | output |
 * | --- |
 * | "No matching order" |
 *
 * @param {Reconciliationreasonnocandidate3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationreasonnocandidate3 =
  /** @type {((inputs?: Reconciliationreasonnocandidate3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationreasonnocandidate3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationreasonnocandidate3(inputs);
      return vi_reconciliationreasonnocandidate3(inputs);
    }
  );
export { reconciliationreasonnocandidate3 as "reconciliationReasonNoCandidate" };
