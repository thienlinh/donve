/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderawaitingconfirmation3Inputs */

const vi_leadsorderawaitingconfirmation3 =
  /** @type {(inputs: Leadsorderawaitingconfirmation3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chờ xác nhận`;
  };

const en_leadsorderawaitingconfirmation3 =
  /** @type {(inputs: Leadsorderawaitingconfirmation3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Awaiting confirmation`;
  };

/**
 * | output |
 * | --- |
 * | "Awaiting confirmation" |
 *
 * @param {Leadsorderawaitingconfirmation3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderawaitingconfirmation3 =
  /** @type {((inputs?: Leadsorderawaitingconfirmation3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderawaitingconfirmation3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderawaitingconfirmation3(inputs);
      return vi_leadsorderawaitingconfirmation3(inputs);
    }
  );
export { leadsorderawaitingconfirmation3 as "leadsOrderAwaitingConfirmation" };
