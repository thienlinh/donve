/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecompilebutton3Inputs */

const vi_prompttemplatecompilebutton3 =
  /** @type {(inputs: Prompttemplatecompilebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Biên dịch`;
  };

const en_prompttemplatecompilebutton3 =
  /** @type {(inputs: Prompttemplatecompilebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Compile`;
  };

/**
 * | output |
 * | --- |
 * | "Compile" |
 *
 * @param {Prompttemplatecompilebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecompilebutton3 =
  /** @type {((inputs?: Prompttemplatecompilebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecompilebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecompilebutton3(inputs);
      return vi_prompttemplatecompilebutton3(inputs);
    }
  );
export { prompttemplatecompilebutton3 as "promptTemplateCompileButton" };
