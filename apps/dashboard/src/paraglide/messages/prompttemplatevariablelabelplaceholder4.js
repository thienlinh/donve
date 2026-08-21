/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatevariablelabelplaceholder4Inputs */

const vi_prompttemplatevariablelabelplaceholder4 =
  /** @type {(inputs: Prompttemplatevariablelabelplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhãn hiển thị`;
  };

const en_prompttemplatevariablelabelplaceholder4 =
  /** @type {(inputs: Prompttemplatevariablelabelplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Display label`;
  };

/**
 * | output |
 * | --- |
 * | "Display label" |
 *
 * @param {Prompttemplatevariablelabelplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatevariablelabelplaceholder4 =
  /** @type {((inputs?: Prompttemplatevariablelabelplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatevariablelabelplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_prompttemplatevariablelabelplaceholder4(inputs);
      return vi_prompttemplatevariablelabelplaceholder4(inputs);
    }
  );
export { prompttemplatevariablelabelplaceholder4 as "promptTemplateVariableLabelPlaceholder" };
