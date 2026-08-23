/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsstatusfailed2Inputs */

const vi_domainsstatusfailed2 =
  /** @type {(inputs: Domainsstatusfailed2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thất bại`;
  };

const en_domainsstatusfailed2 =
  /** @type {(inputs: Domainsstatusfailed2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed`;
  };

/**
 * | output |
 * | --- |
 * | "Failed" |
 *
 * @param {Domainsstatusfailed2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsstatusfailed2 =
  /** @type {((inputs?: Domainsstatusfailed2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsstatusfailed2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsstatusfailed2(inputs);
      return vi_domainsstatusfailed2(inputs);
    }
  );
export { domainsstatusfailed2 as "domainsStatusFailed" };
