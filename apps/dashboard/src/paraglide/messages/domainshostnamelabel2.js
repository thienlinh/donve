/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainshostnamelabel2Inputs */

const vi_domainshostnamelabel2 =
  /** @type {(inputs: Domainshostnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên miền`;
  };

const en_domainshostnamelabel2 =
  /** @type {(inputs: Domainshostnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Domain`;
  };

/**
 * | output |
 * | --- |
 * | "Domain" |
 *
 * @param {Domainshostnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainshostnamelabel2 =
  /** @type {((inputs?: Domainshostnamelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainshostnamelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainshostnamelabel2(inputs);
      return vi_domainshostnamelabel2(inputs);
    }
  );
export { domainshostnamelabel2 as "domainsHostnameLabel" };
