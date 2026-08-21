/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationsearchnoresults3Inputs */

const vi_reconciliationsearchnoresults3 =
  /** @type {(inputs: Reconciliationsearchnoresults3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tìm thấy đơn hàng phù hợp`;
  };

const en_reconciliationsearchnoresults3 =
  /** @type {(inputs: Reconciliationsearchnoresults3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No matching orders`;
  };

/**
 * | output |
 * | --- |
 * | "No matching orders" |
 *
 * @param {Reconciliationsearchnoresults3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationsearchnoresults3 =
  /** @type {((inputs?: Reconciliationsearchnoresults3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationsearchnoresults3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationsearchnoresults3(inputs);
      return vi_reconciliationsearchnoresults3(inputs);
    }
  );
export { reconciliationsearchnoresults3 as "reconciliationSearchNoResults" };
