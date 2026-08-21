/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainscolumnstatus2Inputs */

const vi_domainscolumnstatus2 =
  /** @type {(inputs: Domainscolumnstatus2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_domainscolumnstatus2 =
  /** @type {(inputs: Domainscolumnstatus2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Status`;
  };

/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Domainscolumnstatus2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainscolumnstatus2 =
  /** @type {((inputs?: Domainscolumnstatus2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainscolumnstatus2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainscolumnstatus2(inputs);
      return vi_domainscolumnstatus2(inputs);
    }
  );
export { domainscolumnstatus2 as "domainsColumnStatus" };
