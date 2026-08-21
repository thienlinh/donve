/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesaveerrortoast4Inputs */

const vi_prompttemplatesaveerrortoast4 =
  /** @type {(inputs: Prompttemplatesaveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể lưu mẫu prompt này. Vui lòng thử lại.`;
  };

const en_prompttemplatesaveerrortoast4 =
  /** @type {(inputs: Prompttemplatesaveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this prompt template. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this prompt template. Try again." |
 *
 * @param {Prompttemplatesaveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesaveerrortoast4 =
  /** @type {((inputs?: Prompttemplatesaveerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesaveerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatesaveerrortoast4(inputs);
      return vi_prompttemplatesaveerrortoast4(inputs);
    }
  );
export { prompttemplatesaveerrortoast4 as "promptTemplateSaveErrorToast" };
