/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatevariableslabel3Inputs */

const vi_prompttemplatevariableslabel3 =
  /** @type {(inputs: Prompttemplatevariableslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Biến (variables)`;
  };

const en_prompttemplatevariableslabel3 =
  /** @type {(inputs: Prompttemplatevariableslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Variables`;
  };

/**
 * | output |
 * | --- |
 * | "Variables" |
 *
 * @param {Prompttemplatevariableslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatevariableslabel3 =
  /** @type {((inputs?: Prompttemplatevariableslabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatevariableslabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatevariableslabel3(inputs);
      return vi_prompttemplatevariableslabel3(inputs);
    }
  );
export { prompttemplatevariableslabel3 as "promptTemplateVariablesLabel" };
