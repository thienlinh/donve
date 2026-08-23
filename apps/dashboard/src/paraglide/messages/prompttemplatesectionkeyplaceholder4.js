/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesectionkeyplaceholder4Inputs */

const vi_prompttemplatesectionkeyplaceholder4 =
  /** @type {(inputs: Prompttemplatesectionkeyplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khóa của phần`;
  };

const en_prompttemplatesectionkeyplaceholder4 =
  /** @type {(inputs: Prompttemplatesectionkeyplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Section key`;
  };

/**
 * | output |
 * | --- |
 * | "Section key" |
 *
 * @param {Prompttemplatesectionkeyplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesectionkeyplaceholder4 =
  /** @type {((inputs?: Prompttemplatesectionkeyplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesectionkeyplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_prompttemplatesectionkeyplaceholder4(inputs);
      return vi_prompttemplatesectionkeyplaceholder4(inputs);
    }
  );
export { prompttemplatesectionkeyplaceholder4 as "promptTemplateSectionKeyPlaceholder" };
