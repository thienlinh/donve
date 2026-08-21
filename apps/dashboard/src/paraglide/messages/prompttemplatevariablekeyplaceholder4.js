/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatevariablekeyplaceholder4Inputs */

const vi_prompttemplatevariablekeyplaceholder4 =
  /** @type {(inputs: Prompttemplatevariablekeyplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `vd: brand`;
  };

const en_prompttemplatevariablekeyplaceholder4 =
  /** @type {(inputs: Prompttemplatevariablekeyplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `e.g. brand`;
  };

/**
 * | output |
 * | --- |
 * | "e.g. brand" |
 *
 * @param {Prompttemplatevariablekeyplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatevariablekeyplaceholder4 =
  /** @type {((inputs?: Prompttemplatevariablekeyplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatevariablekeyplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_prompttemplatevariablekeyplaceholder4(inputs);
      return vi_prompttemplatevariablekeyplaceholder4(inputs);
    }
  );
export { prompttemplatevariablekeyplaceholder4 as "promptTemplateVariableKeyPlaceholder" };
