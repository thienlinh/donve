/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimporthtmlplaceholder3Inputs */

const vi_landingsimporthtmlplaceholder3 =
  /** @type {(inputs: Landingsimporthtmlplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán mã HTML của trang…`;
  };

const en_landingsimporthtmlplaceholder3 =
  /** @type {(inputs: Landingsimporthtmlplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste the page's HTML…`;
  };

/**
 * | output |
 * | --- |
 * | "Paste the page's HTML…" |
 *
 * @param {Landingsimporthtmlplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimporthtmlplaceholder3 =
  /** @type {((inputs?: Landingsimporthtmlplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimporthtmlplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimporthtmlplaceholder3(inputs);
      return vi_landingsimporthtmlplaceholder3(inputs);
    }
  );
export { landingsimporthtmlplaceholder3 as "landingsImportHtmlPlaceholder" };
