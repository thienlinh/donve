/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellreconciliationnav2Inputs */

const vi_shellreconciliationnav2 =
  /** @type {(inputs: Shellreconciliationnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đối soát`;
  };

const en_shellreconciliationnav2 =
  /** @type {(inputs: Shellreconciliationnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reconciliation`;
  };

/**
 * | output |
 * | --- |
 * | "Reconciliation" |
 *
 * @param {Shellreconciliationnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellreconciliationnav2 =
  /** @type {((inputs?: Shellreconciliationnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellreconciliationnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellreconciliationnav2(inputs);
      return vi_shellreconciliationnav2(inputs);
    }
  );
export { shellreconciliationnav2 as "shellReconciliationNav" };
