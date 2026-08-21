/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateaddvariable3Inputs */

const vi_prompttemplateaddvariable3 =
  /** @type {(inputs: Prompttemplateaddvariable3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm biến`;
  };

const en_prompttemplateaddvariable3 =
  /** @type {(inputs: Prompttemplateaddvariable3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add variable`;
  };

/**
 * | output |
 * | --- |
 * | "Add variable" |
 *
 * @param {Prompttemplateaddvariable3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateaddvariable3 =
  /** @type {((inputs?: Prompttemplateaddvariable3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateaddvariable3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateaddvariable3(inputs);
      return vi_prompttemplateaddvariable3(inputs);
    }
  );
export { prompttemplateaddvariable3 as "promptTemplateAddVariable" };
