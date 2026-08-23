/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationemptytitle2Inputs */

const vi_reconciliationemptytitle2 =
  /** @type {(inputs: Reconciliationemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có giao dịch chưa khớp`;
  };

const en_reconciliationemptytitle2 =
  /** @type {(inputs: Reconciliationemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No unmatched transactions`;
  };

/**
 * | output |
 * | --- |
 * | "No unmatched transactions" |
 *
 * @param {Reconciliationemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationemptytitle2 =
  /** @type {((inputs?: Reconciliationemptytitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationemptytitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationemptytitle2(inputs);
      return vi_reconciliationemptytitle2(inputs);
    }
  );
export { reconciliationemptytitle2 as "reconciliationEmptyTitle" };
