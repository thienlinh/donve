/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesloaderrortitle4Inputs */

const vi_prompttemplatesloaderrortitle4 =
  /** @type {(inputs: Prompttemplatesloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách mẫu prompt`;
  };

const en_prompttemplatesloaderrortitle4 =
  /** @type {(inputs: Prompttemplatesloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load prompt templates`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load prompt templates" |
 *
 * @param {Prompttemplatesloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesloaderrortitle4 =
  /** @type {((inputs?: Prompttemplatesloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatesloaderrortitle4(inputs);
      return vi_prompttemplatesloaderrortitle4(inputs);
    }
  );
export { prompttemplatesloaderrortitle4 as "promptTemplatesLoadErrorTitle" };
