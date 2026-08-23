/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationreasonambiguous2Inputs */

const vi_reconciliationreasonambiguous2 =
  /** @type {(inputs: Reconciliationreasonambiguous2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nghi vấn (nhiều đơn khớp)`;
  };

const en_reconciliationreasonambiguous2 =
  /** @type {(inputs: Reconciliationreasonambiguous2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ambiguous match`;
  };

/**
 * | output |
 * | --- |
 * | "Ambiguous match" |
 *
 * @param {Reconciliationreasonambiguous2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationreasonambiguous2 =
  /** @type {((inputs?: Reconciliationreasonambiguous2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationreasonambiguous2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationreasonambiguous2(inputs);
      return vi_reconciliationreasonambiguous2(inputs);
    }
  );
export { reconciliationreasonambiguous2 as "reconciliationReasonAmbiguous" };
