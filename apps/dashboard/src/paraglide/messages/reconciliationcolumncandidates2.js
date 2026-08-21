/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationcolumncandidates2Inputs */

const vi_reconciliationcolumncandidates2 =
  /** @type {(inputs: Reconciliationcolumncandidates2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đơn hàng ứng viên`;
  };

const en_reconciliationcolumncandidates2 =
  /** @type {(inputs: Reconciliationcolumncandidates2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Candidate orders`;
  };

/**
 * | output |
 * | --- |
 * | "Candidate orders" |
 *
 * @param {Reconciliationcolumncandidates2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationcolumncandidates2 =
  /** @type {((inputs?: Reconciliationcolumncandidates2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationcolumncandidates2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationcolumncandidates2(inputs);
      return vi_reconciliationcolumncandidates2(inputs);
    }
  );
export { reconciliationcolumncandidates2 as "reconciliationColumnCandidates" };
