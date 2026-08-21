/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsadddialogtitle3Inputs */

const vi_domainsadddialogtitle3 =
  /** @type {(inputs: Domainsadddialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm tên miền riêng`;
  };

const en_domainsadddialogtitle3 =
  /** @type {(inputs: Domainsadddialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add a custom domain`;
  };

/**
 * | output |
 * | --- |
 * | "Add a custom domain" |
 *
 * @param {Domainsadddialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsadddialogtitle3 =
  /** @type {((inputs?: Domainsadddialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsadddialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsadddialogtitle3(inputs);
      return vi_domainsadddialogtitle3(inputs);
    }
  );
export { domainsadddialogtitle3 as "domainsAddDialogTitle" };
