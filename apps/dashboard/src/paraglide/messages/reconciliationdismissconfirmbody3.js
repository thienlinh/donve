/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationdismissconfirmbody3Inputs */

const vi_reconciliationdismissconfirmbody3 =
  /** @type {(inputs: Reconciliationdismissconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giao dịch sẽ được đánh dấu đã xử lý mà không gán vào đơn hàng nào.`;
  };

const en_reconciliationdismissconfirmbody3 =
  /** @type {(inputs: Reconciliationdismissconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `It will be marked resolved without being attached to any order.`;
  };

/**
 * | output |
 * | --- |
 * | "It will be marked resolved without being attached to any order." |
 *
 * @param {Reconciliationdismissconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationdismissconfirmbody3 =
  /** @type {((inputs?: Reconciliationdismissconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationdismissconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationdismissconfirmbody3(inputs);
      return vi_reconciliationdismissconfirmbody3(inputs);
    }
  );
export { reconciliationdismissconfirmbody3 as "reconciliationDismissConfirmBody" };
