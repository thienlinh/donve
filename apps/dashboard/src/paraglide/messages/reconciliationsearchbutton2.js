/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reconciliationsearchbutton2Inputs */

const vi_reconciliationsearchbutton2 =
  /** @type {(inputs: Reconciliationsearchbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tìm kiếm`;
  };

const en_reconciliationsearchbutton2 =
  /** @type {(inputs: Reconciliationsearchbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Search`;
  };

/**
 * | output |
 * | --- |
 * | "Search" |
 *
 * @param {Reconciliationsearchbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const reconciliationsearchbutton2 =
  /** @type {((inputs?: Reconciliationsearchbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reconciliationsearchbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_reconciliationsearchbutton2(inputs);
      return vi_reconciliationsearchbutton2(inputs);
    }
  );
export { reconciliationsearchbutton2 as "reconciliationSearchButton" };
