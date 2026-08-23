/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsremoveaction2Inputs */

const vi_domainsremoveaction2 =
  /** @type {(inputs: Domainsremoveaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa tên miền`;
  };

const en_domainsremoveaction2 =
  /** @type {(inputs: Domainsremoveaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove domain`;
  };

/**
 * | output |
 * | --- |
 * | "Remove domain" |
 *
 * @param {Domainsremoveaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsremoveaction2 =
  /** @type {((inputs?: Domainsremoveaction2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsremoveaction2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsremoveaction2(inputs);
      return vi_domainsremoveaction2(inputs);
    }
  );
export { domainsremoveaction2 as "domainsRemoveAction" };
