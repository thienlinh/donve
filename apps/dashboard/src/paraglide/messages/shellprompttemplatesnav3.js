/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellprompttemplatesnav3Inputs */

const vi_shellprompttemplatesnav3 =
  /** @type {(inputs: Shellprompttemplatesnav3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mẫu prompt`;
  };

const en_shellprompttemplatesnav3 =
  /** @type {(inputs: Shellprompttemplatesnav3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Prompt templates`;
  };

/**
 * | output |
 * | --- |
 * | "Prompt templates" |
 *
 * @param {Shellprompttemplatesnav3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellprompttemplatesnav3 =
  /** @type {((inputs?: Shellprompttemplatesnav3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellprompttemplatesnav3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellprompttemplatesnav3(inputs);
      return vi_shellprompttemplatesnav3(inputs);
    }
  );
export { shellprompttemplatesnav3 as "shellPromptTemplatesNav" };
