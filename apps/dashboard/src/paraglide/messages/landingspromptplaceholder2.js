/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingspromptplaceholder2Inputs */

const vi_landingspromptplaceholder2 =
  /** @type {(inputs: Landingspromptplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mô tả landing page bạn muốn tạo…`;
  };

const en_landingspromptplaceholder2 =
  /** @type {(inputs: Landingspromptplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Describe the landing page you want…`;
  };

/**
 * | output |
 * | --- |
 * | "Describe the landing page you want…" |
 *
 * @param {Landingspromptplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingspromptplaceholder2 =
  /** @type {((inputs?: Landingspromptplaceholder2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingspromptplaceholder2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingspromptplaceholder2(inputs);
      return vi_landingspromptplaceholder2(inputs);
    }
  );
export { landingspromptplaceholder2 as "landingsPromptPlaceholder" };
