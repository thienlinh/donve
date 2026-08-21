/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateremoveerrortoast4Inputs */

const vi_prompttemplateremoveerrortoast4 =
  /** @type {(inputs: Prompttemplateremoveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể xóa mẫu prompt này. Vui lòng thử lại.`;
  };

const en_prompttemplateremoveerrortoast4 =
  /** @type {(inputs: Prompttemplateremoveerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this prompt template. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this prompt template. Try again." |
 *
 * @param {Prompttemplateremoveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateremoveerrortoast4 =
  /** @type {((inputs?: Prompttemplateremoveerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateremoveerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateremoveerrortoast4(inputs);
      return vi_prompttemplateremoveerrortoast4(inputs);
    }
  );
export { prompttemplateremoveerrortoast4 as "promptTemplateRemoveErrorToast" };
