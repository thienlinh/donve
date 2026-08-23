/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesluglabel3Inputs */

const vi_prompttemplatesluglabel3 =
  /** @type {(inputs: Prompttemplatesluglabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

const en_prompttemplatesluglabel3 =
  /** @type {(inputs: Prompttemplatesluglabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Prompttemplatesluglabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesluglabel3 =
  /** @type {((inputs?: Prompttemplatesluglabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesluglabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatesluglabel3(inputs);
      return vi_prompttemplatesluglabel3(inputs);
    }
  );
export { prompttemplatesluglabel3 as "promptTemplateSlugLabel" };
