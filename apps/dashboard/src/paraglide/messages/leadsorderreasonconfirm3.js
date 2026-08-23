/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderreasonconfirm3Inputs */

const vi_leadsorderreasonconfirm3 =
  /** @type {(inputs: Leadsorderreasonconfirm3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xác nhận`;
  };

const en_leadsorderreasonconfirm3 =
  /** @type {(inputs: Leadsorderreasonconfirm3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Confirm`;
  };

/**
 * | output |
 * | --- |
 * | "Confirm" |
 *
 * @param {Leadsorderreasonconfirm3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderreasonconfirm3 =
  /** @type {((inputs?: Leadsorderreasonconfirm3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderreasonconfirm3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderreasonconfirm3(inputs);
      return vi_leadsorderreasonconfirm3(inputs);
    }
  );
export { leadsorderreasonconfirm3 as "leadsOrderReasonConfirm" };
