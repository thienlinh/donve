/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainslandingpageplaceholder3Inputs */

const vi_domainslandingpageplaceholder3 =
  /** @type {(inputs: Domainslandingpageplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn một trang landing đã publish`;
  };

const en_domainslandingpageplaceholder3 =
  /** @type {(inputs: Domainslandingpageplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Choose a published landing page`;
  };

/**
 * | output |
 * | --- |
 * | "Choose a published landing page" |
 *
 * @param {Domainslandingpageplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainslandingpageplaceholder3 =
  /** @type {((inputs?: Domainslandingpageplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainslandingpageplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainslandingpageplaceholder3(inputs);
      return vi_domainslandingpageplaceholder3(inputs);
    }
  );
export { domainslandingpageplaceholder3 as "domainsLandingPagePlaceholder" };
