/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationdismissconfirmtitle3Inputs */

const vi_reconciliationdismissconfirmtitle3 =
  /** @type {(inputs: Reconciliationdismissconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bỏ qua giao dịch này?`;
  };

const en_reconciliationdismissconfirmtitle3 =
  /** @type {(inputs: Reconciliationdismissconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dismiss this transaction?`;
  };

/**
 * | output |
 * | --- |
 * | "Dismiss this transaction?" |
 *
 * @param {Reconciliationdismissconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationdismissconfirmtitle3 =
  /** @type {((inputs?: Reconciliationdismissconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationdismissconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationdismissconfirmtitle3(inputs);
      return vi_reconciliationdismissconfirmtitle3(inputs);
    }
  );
export { reconciliationdismissconfirmtitle3 as "reconciliationDismissConfirmTitle" };
