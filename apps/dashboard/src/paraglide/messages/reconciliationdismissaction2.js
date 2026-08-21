/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationdismissaction2Inputs */

const vi_reconciliationdismissaction2 =
  /** @type {(inputs: Reconciliationdismissaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bỏ qua`;
  };

const en_reconciliationdismissaction2 =
  /** @type {(inputs: Reconciliationdismissaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dismiss`;
  };

/**
 * | output |
 * | --- |
 * | "Dismiss" |
 *
 * @param {Reconciliationdismissaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationdismissaction2 =
  /** @type {((inputs?: Reconciliationdismissaction2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationdismissaction2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationdismissaction2(inputs);
      return vi_reconciliationdismissaction2(inputs);
    }
  );
export { reconciliationdismissaction2 as "reconciliationDismissAction" };
