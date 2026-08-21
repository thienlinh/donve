/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsaddsubmit2Inputs */

const vi_domainsaddsubmit2 =
  /** @type {(inputs: Domainsaddsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm tên miền`;
  };

const en_domainsaddsubmit2 =
  /** @type {(inputs: Domainsaddsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add domain`;
  };

/**
 * | output |
 * | --- |
 * | "Add domain" |
 *
 * @param {Domainsaddsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsaddsubmit2 =
  /** @type {((inputs?: Domainsaddsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsaddsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsaddsubmit2(inputs);
      return vi_domainsaddsubmit2(inputs);
    }
  );
export { domainsaddsubmit2 as "domainsAddSubmit" };
