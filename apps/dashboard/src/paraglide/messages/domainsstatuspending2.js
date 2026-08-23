/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsstatuspending2Inputs */

const vi_domainsstatuspending2 =
  /** @type {(inputs: Domainsstatuspending2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang chờ`;
  };

const en_domainsstatuspending2 =
  /** @type {(inputs: Domainsstatuspending2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pending`;
  };

/**
 * | output |
 * | --- |
 * | "Pending" |
 *
 * @param {Domainsstatuspending2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsstatuspending2 =
  /** @type {((inputs?: Domainsstatuspending2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsstatuspending2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsstatuspending2(inputs);
      return vi_domainsstatuspending2(inputs);
    }
  );
export { domainsstatuspending2 as "domainsStatusPending" };
