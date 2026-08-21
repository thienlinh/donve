/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationresolveerrortoast3Inputs */

const vi_reconciliationresolveerrortoast3 =
  /** @type {(inputs: Reconciliationresolveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể gán giao dịch này. Vui lòng thử lại.`;
  };

const en_reconciliationresolveerrortoast3 =
  /** @type {(inputs: Reconciliationresolveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't assign this transaction. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't assign this transaction. Try again." |
 *
 * @param {Reconciliationresolveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationresolveerrortoast3 =
  /** @type {((inputs?: Reconciliationresolveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationresolveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationresolveerrortoast3(inputs);
      return vi_reconciliationresolveerrortoast3(inputs);
    }
  );
export { reconciliationresolveerrortoast3 as "reconciliationResolveErrorToast" };
