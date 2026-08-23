/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationreasonalreadypaid3Inputs */

const vi_reconciliationreasonalreadypaid3 =
  /** @type {(inputs: Reconciliationreasonalreadypaid3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đơn đã thanh toán`;
  };

const en_reconciliationreasonalreadypaid3 =
  /** @type {(inputs: Reconciliationreasonalreadypaid3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Order already paid`;
  };

/**
 * | output |
 * | --- |
 * | "Order already paid" |
 *
 * @param {Reconciliationreasonalreadypaid3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationreasonalreadypaid3 =
  /** @type {((inputs?: Reconciliationreasonalreadypaid3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationreasonalreadypaid3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationreasonalreadypaid3(inputs);
      return vi_reconciliationreasonalreadypaid3(inputs);
    }
  );
export { reconciliationreasonalreadypaid3 as "reconciliationReasonAlreadyPaid" };
