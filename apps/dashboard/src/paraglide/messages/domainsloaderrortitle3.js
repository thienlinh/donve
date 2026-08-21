/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsloaderrortitle3Inputs */

const vi_domainsloaderrortitle3 =
  /** @type {(inputs: Domainsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách tên miền`;
  };

const en_domainsloaderrortitle3 =
  /** @type {(inputs: Domainsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load custom domains`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load custom domains" |
 *
 * @param {Domainsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsloaderrortitle3 =
  /** @type {((inputs?: Domainsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsloaderrortitle3(inputs);
      return vi_domainsloaderrortitle3(inputs);
    }
  );
export { domainsloaderrortitle3 as "domainsLoadErrorTitle" };
