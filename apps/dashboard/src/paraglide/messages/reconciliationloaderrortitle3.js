/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationloaderrortitle3Inputs */

const vi_reconciliationloaderrortitle3 =
  /** @type {(inputs: Reconciliationloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách giao dịch chưa khớp`;
  };

const en_reconciliationloaderrortitle3 =
  /** @type {(inputs: Reconciliationloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load unmatched transactions`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load unmatched transactions" |
 *
 * @param {Reconciliationloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationloaderrortitle3 =
  /** @type {((inputs?: Reconciliationloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationloaderrortitle3(inputs);
      return vi_reconciliationloaderrortitle3(inputs);
    }
  );
export { reconciliationloaderrortitle3 as "reconciliationLoadErrorTitle" };
