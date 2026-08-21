/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatestitle2Inputs */

const vi_prompttemplatestitle2 =
  /** @type {(inputs: Prompttemplatestitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mẫu prompt`;
  };

const en_prompttemplatestitle2 =
  /** @type {(inputs: Prompttemplatestitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Prompt templates`;
  };

/**
 * | output |
 * | --- |
 * | "Prompt templates" |
 *
 * @param {Prompttemplatestitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatestitle2 =
  /** @type {((inputs?: Prompttemplatestitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatestitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatestitle2(inputs);
      return vi_prompttemplatestitle2(inputs);
    }
  );
export { prompttemplatestitle2 as "promptTemplatesTitle" };
