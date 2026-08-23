/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsstatusactive2Inputs */

const vi_domainsstatusactive2 =
  /** @type {(inputs: Domainsstatusactive2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã kích hoạt`;
  };

const en_domainsstatusactive2 =
  /** @type {(inputs: Domainsstatusactive2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Active`;
  };

/**
 * | output |
 * | --- |
 * | "Active" |
 *
 * @param {Domainsstatusactive2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsstatusactive2 =
  /** @type {((inputs?: Domainsstatusactive2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsstatusactive2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsstatusactive2(inputs);
      return vi_domainsstatusactive2(inputs);
    }
  );
export { domainsstatusactive2 as "domainsStatusActive" };
