/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationdescription1Inputs */

const vi_reconciliationdescription1 =
  /** @type {(inputs: Reconciliationdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giao dịch chuyển khoản chưa khớp — chọn đúng đơn hàng cho các trường hợp nghi vấn, hoặc để lại xem xét sau.`;
  };

const en_reconciliationdescription1 =
  /** @type {(inputs: Reconciliationdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unmatched bank transfers — pick the right order for ambiguous matches, or leave for review otherwise.`;
  };

/**
 * | output |
 * | --- |
 * | "Unmatched bank transfers — pick the right order for ambiguous matches, or leave for review otherwise." |
 *
 * @param {Reconciliationdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationdescription1 =
  /** @type {((inputs?: Reconciliationdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationdescription1(inputs);
      return vi_reconciliationdescription1(inputs);
    }
  );
export { reconciliationdescription1 as "reconciliationDescription" };
