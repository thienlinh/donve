/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsordercancel2Inputs */

const vi_leadsordercancel2 =
  /** @type {(inputs: Leadsordercancel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Huỷ đơn`;
  };

const en_leadsordercancel2 =
  /** @type {(inputs: Leadsordercancel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cancel order`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel order" |
 *
 * @param {Leadsordercancel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsordercancel2 =
  /** @type {((inputs?: Leadsordercancel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsordercancel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsordercancel2(inputs);
      return vi_leadsordercancel2(inputs);
    }
  );
export { leadsordercancel2 as "leadsOrderCancel" };
