/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmssecretkeylabel5Inputs */

const vi_leadsnotifyesmssecretkeylabel5 =
  /** @type {(inputs: Leadsnotifyesmssecretkeylabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Secret key`;
  };

const en_leadsnotifyesmssecretkeylabel5 =
  /** @type {(inputs: Leadsnotifyesmssecretkeylabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Secret key`;
  };

/**
 * | output |
 * | --- |
 * | "Secret key" |
 *
 * @param {Leadsnotifyesmssecretkeylabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmssecretkeylabel5 =
  /** @type {((inputs?: Leadsnotifyesmssecretkeylabel5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmssecretkeylabel5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyesmssecretkeylabel5(inputs);
      return vi_leadsnotifyesmssecretkeylabel5(inputs);
    }
  );
export { leadsnotifyesmssecretkeylabel5 as "leadsNotifyEsmsSecretKeyLabel" };
