/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainstitle1Inputs */

const vi_domainstitle1 =
  /** @type {(inputs: Domainstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên miền riêng`;
  };

const en_domainstitle1 =
  /** @type {(inputs: Domainstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Custom domains`;
  };

/**
 * | output |
 * | --- |
 * | "Custom domains" |
 *
 * @param {Domainstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainstitle1 =
  /** @type {((inputs?: Domainstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainstitle1(inputs);
      return vi_domainstitle1(inputs);
    }
  );
export { domainstitle1 as "domainsTitle" };
