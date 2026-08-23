/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsunreadindicatorlabel3Inputs */

const vi_leadsunreadindicatorlabel3 =
  /** @type {(inputs: Leadsunreadindicatorlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa xem`;
  };

const en_leadsunreadindicatorlabel3 =
  /** @type {(inputs: Leadsunreadindicatorlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unread`;
  };

/**
 * | output |
 * | --- |
 * | "Unread" |
 *
 * @param {Leadsunreadindicatorlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsunreadindicatorlabel3 =
  /** @type {((inputs?: Leadsunreadindicatorlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsunreadindicatorlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsunreadindicatorlabel3(inputs);
      return vi_leadsunreadindicatorlabel3(inputs);
    }
  );
export { leadsunreadindicatorlabel3 as "leadsUnreadIndicatorLabel" };
