/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationtitle1Inputs */

const vi_reconciliationtitle1 =
  /** @type {(inputs: Reconciliationtitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đối soát`;
  };

const en_reconciliationtitle1 =
  /** @type {(inputs: Reconciliationtitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reconciliation`;
  };

/**
 * | output |
 * | --- |
 * | "Reconciliation" |
 *
 * @param {Reconciliationtitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationtitle1 =
  /** @type {((inputs?: Reconciliationtitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationtitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationtitle1(inputs);
      return vi_reconciliationtitle1(inputs);
    }
  );
export { reconciliationtitle1 as "reconciliationTitle" };
