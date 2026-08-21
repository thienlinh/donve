/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecompileerrortoast4Inputs */

const vi_prompttemplatecompileerrortoast4 =
  /** @type {(inputs: Prompttemplatecompileerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể biên dịch mẫu này. Kiểm tra lại các biến bắt buộc.`;
  };

const en_prompttemplatecompileerrortoast4 =
  /** @type {(inputs: Prompttemplatecompileerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't compile this template. Check the required variables.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't compile this template. Check the required variables." |
 *
 * @param {Prompttemplatecompileerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecompileerrortoast4 =
  /** @type {((inputs?: Prompttemplatecompileerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecompileerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecompileerrortoast4(inputs);
      return vi_prompttemplatecompileerrortoast4(inputs);
    }
  );
export { prompttemplatecompileerrortoast4 as "promptTemplateCompileErrorToast" };
