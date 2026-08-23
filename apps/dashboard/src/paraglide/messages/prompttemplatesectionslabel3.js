/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesectionslabel3Inputs */

const vi_prompttemplatesectionslabel3 =
  /** @type {(inputs: Prompttemplatesectionslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các phần (sections)`;
  };

const en_prompttemplatesectionslabel3 =
  /** @type {(inputs: Prompttemplatesectionslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sections`;
  };

/**
 * | output |
 * | --- |
 * | "Sections" |
 *
 * @param {Prompttemplatesectionslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesectionslabel3 =
  /** @type {((inputs?: Prompttemplatesectionslabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesectionslabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatesectionslabel3(inputs);
      return vi_prompttemplatesectionslabel3(inputs);
    }
  );
export { prompttemplatesectionslabel3 as "promptTemplateSectionsLabel" };
