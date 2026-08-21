/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecompareheading3Inputs */

const vi_prompttemplatecompareheading3 =
  /** @type {(inputs: Prompttemplatecompareheading3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang so sánh 2 lần chạy`;
  };

const en_prompttemplatecompareheading3 =
  /** @type {(inputs: Prompttemplatecompareheading3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Comparing 2 runs`;
  };

/**
 * | output |
 * | --- |
 * | "Comparing 2 runs" |
 *
 * @param {Prompttemplatecompareheading3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecompareheading3 =
  /** @type {((inputs?: Prompttemplatecompareheading3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecompareheading3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecompareheading3(inputs);
      return vi_prompttemplatecompareheading3(inputs);
    }
  );
export { prompttemplatecompareheading3 as "promptTemplateCompareHeading" };
