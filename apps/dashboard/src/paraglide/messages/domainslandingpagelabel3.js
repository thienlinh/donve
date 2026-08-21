/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainslandingpagelabel3Inputs */

const vi_domainslandingpagelabel3 =
  /** @type {(inputs: Domainslandingpagelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang landing`;
  };

const en_domainslandingpagelabel3 =
  /** @type {(inputs: Domainslandingpagelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing page`;
  };

/**
 * | output |
 * | --- |
 * | "Landing page" |
 *
 * @param {Domainslandingpagelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainslandingpagelabel3 =
  /** @type {((inputs?: Domainslandingpagelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainslandingpagelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainslandingpagelabel3(inputs);
      return vi_domainslandingpagelabel3(inputs);
    }
  );
export { domainslandingpagelabel3 as "domainsLandingPageLabel" };
