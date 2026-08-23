/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderreasoncancel3Inputs */

const vi_leadsorderreasoncancel3 =
  /** @type {(inputs: Leadsorderreasoncancel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Huỷ`;
  };

const en_leadsorderreasoncancel3 =
  /** @type {(inputs: Leadsorderreasoncancel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cancel`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Leadsorderreasoncancel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderreasoncancel3 =
  /** @type {((inputs?: Leadsorderreasoncancel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderreasoncancel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderreasoncancel3(inputs);
      return vi_leadsorderreasoncancel3(inputs);
    }
  );
export { leadsorderreasoncancel3 as "leadsOrderReasonCancel" };
