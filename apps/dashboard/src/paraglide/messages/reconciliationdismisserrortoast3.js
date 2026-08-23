/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationdismisserrortoast3Inputs */

const vi_reconciliationdismisserrortoast3 =
  /** @type {(inputs: Reconciliationdismisserrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể bỏ qua giao dịch này. Vui lòng thử lại.`;
  };

const en_reconciliationdismisserrortoast3 =
  /** @type {(inputs: Reconciliationdismisserrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't dismiss this transaction. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't dismiss this transaction. Try again." |
 *
 * @param {Reconciliationdismisserrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationdismisserrortoast3 =
  /** @type {((inputs?: Reconciliationdismisserrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationdismisserrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationdismisserrortoast3(inputs);
      return vi_reconciliationdismisserrortoast3(inputs);
    }
  );
export { reconciliationdismisserrortoast3 as "reconciliationDismissErrorToast" };
