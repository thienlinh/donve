/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainscolumnactions2Inputs */

const vi_domainscolumnactions2 =
  /** @type {(inputs: Domainscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hành động`;
  };

const en_domainscolumnactions2 =
  /** @type {(inputs: Domainscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Domainscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainscolumnactions2 =
  /** @type {((inputs?: Domainscolumnactions2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainscolumnactions2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainscolumnactions2(inputs);
      return vi_domainscolumnactions2(inputs);
    }
  );
export { domainscolumnactions2 as "domainsColumnActions" };
