/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecolumnversion3Inputs */

const vi_prompttemplatecolumnversion3 =
  /** @type {(inputs: Prompttemplatecolumnversion3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Phiên bản`;
  };

const en_prompttemplatecolumnversion3 =
  /** @type {(inputs: Prompttemplatecolumnversion3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Version`;
  };

/**
 * | output |
 * | --- |
 * | "Version" |
 *
 * @param {Prompttemplatecolumnversion3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecolumnversion3 =
  /** @type {((inputs?: Prompttemplatecolumnversion3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecolumnversion3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecolumnversion3(inputs);
      return vi_prompttemplatecolumnversion3(inputs);
    }
  );
export { prompttemplatecolumnversion3 as "promptTemplateColumnVersion" };
