/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainscolumnhostname2Inputs */

const vi_domainscolumnhostname2 =
  /** @type {(inputs: Domainscolumnhostname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên miền`;
  };

const en_domainscolumnhostname2 =
  /** @type {(inputs: Domainscolumnhostname2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Domain`;
  };

/**
 * | output |
 * | --- |
 * | "Domain" |
 *
 * @param {Domainscolumnhostname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainscolumnhostname2 =
  /** @type {((inputs?: Domainscolumnhostname2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainscolumnhostname2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainscolumnhostname2(inputs);
      return vi_domainscolumnhostname2(inputs);
    }
  );
export { domainscolumnhostname2 as "domainsColumnHostname" };
