/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatenotfoundtitle4Inputs */

const vi_prompttemplatenotfoundtitle4 =
  /** @type {(inputs: Prompttemplatenotfoundtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tìm thấy mẫu prompt`;
  };

const en_prompttemplatenotfoundtitle4 =
  /** @type {(inputs: Prompttemplatenotfoundtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Prompt template not found`;
  };

/**
 * | output |
 * | --- |
 * | "Prompt template not found" |
 *
 * @param {Prompttemplatenotfoundtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatenotfoundtitle4 =
  /** @type {((inputs?: Prompttemplatenotfoundtitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatenotfoundtitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatenotfoundtitle4(inputs);
      return vi_prompttemplatenotfoundtitle4(inputs);
    }
  );
export { prompttemplatenotfoundtitle4 as "promptTemplateNotFoundTitle" };
