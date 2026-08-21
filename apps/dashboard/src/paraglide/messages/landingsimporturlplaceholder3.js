/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimporturlplaceholder3Inputs */

const vi_landingsimporturlplaceholder3 =
  /** @type {(inputs: Landingsimporturlplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `https://ví-dụ.com/landing-page`;
  };

const en_landingsimporturlplaceholder3 =
  /** @type {(inputs: Landingsimporturlplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `https://example.com/landing-page`;
  };

/**
 * | output |
 * | --- |
 * | "https://example.com/landing-page" |
 *
 * @param {Landingsimporturlplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimporturlplaceholder3 =
  /** @type {((inputs?: Landingsimporturlplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimporturlplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimporturlplaceholder3(inputs);
      return vi_landingsimporturlplaceholder3(inputs);
    }
  );
export { landingsimporturlplaceholder3 as "landingsImportUrlPlaceholder" };
