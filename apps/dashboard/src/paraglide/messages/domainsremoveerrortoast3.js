/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsremoveerrortoast3Inputs */

const vi_domainsremoveerrortoast3 =
  /** @type {(inputs: Domainsremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xóa được tên miền này. Vui lòng thử lại.`;
  };

const en_domainsremoveerrortoast3 =
  /** @type {(inputs: Domainsremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this domain. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this domain. Try again." |
 *
 * @param {Domainsremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsremoveerrortoast3 =
  /** @type {((inputs?: Domainsremoveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsremoveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsremoveerrortoast3(inputs);
      return vi_domainsremoveerrortoast3(inputs);
    }
  );
export { domainsremoveerrortoast3 as "domainsRemoveErrorToast" };
