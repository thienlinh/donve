/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsemptytitle2Inputs */

const vi_domainsemptytitle2 =
  /** @type {(inputs: Domainsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có tên miền riêng nào`;
  };

const en_domainsemptytitle2 =
  /** @type {(inputs: Domainsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No custom domain yet`;
  };

/**
 * | output |
 * | --- |
 * | "No custom domain yet" |
 *
 * @param {Domainsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsemptytitle2 =
  /** @type {((inputs?: Domainsemptytitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsemptytitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsemptytitle2(inputs);
      return vi_domainsemptytitle2(inputs);
    }
  );
export { domainsemptytitle2 as "domainsEmptyTitle" };
