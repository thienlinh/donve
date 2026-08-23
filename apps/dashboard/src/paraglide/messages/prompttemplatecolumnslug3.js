/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecolumnslug3Inputs */

const vi_prompttemplatecolumnslug3 =
  /** @type {(inputs: Prompttemplatecolumnslug3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

const en_prompttemplatecolumnslug3 =
  /** @type {(inputs: Prompttemplatecolumnslug3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Slug`;
  };

/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Prompttemplatecolumnslug3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecolumnslug3 =
  /** @type {((inputs?: Prompttemplatecolumnslug3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecolumnslug3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecolumnslug3(inputs);
      return vi_prompttemplatecolumnslug3(inputs);
    }
  );
export { prompttemplatecolumnslug3 as "promptTemplateColumnSlug" };
