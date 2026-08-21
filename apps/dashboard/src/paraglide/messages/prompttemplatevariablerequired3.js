/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatevariablerequired3Inputs */

const vi_prompttemplatevariablerequired3 =
  /** @type {(inputs: Prompttemplatevariablerequired3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bắt buộc`;
  };

const en_prompttemplatevariablerequired3 =
  /** @type {(inputs: Prompttemplatevariablerequired3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Required`;
  };

/**
 * | output |
 * | --- |
 * | "Required" |
 *
 * @param {Prompttemplatevariablerequired3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatevariablerequired3 =
  /** @type {((inputs?: Prompttemplatevariablerequired3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatevariablerequired3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatevariablerequired3(inputs);
      return vi_prompttemplatevariablerequired3(inputs);
    }
  );
export { prompttemplatevariablerequired3 as "promptTemplateVariableRequired" };
