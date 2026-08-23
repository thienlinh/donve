/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateremoveconfirmtitle4Inputs */

const vi_prompttemplateremoveconfirmtitle4 =
  /** @type {(inputs: Prompttemplateremoveconfirmtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa mẫu prompt này?`;
  };

const en_prompttemplateremoveconfirmtitle4 =
  /** @type {(inputs: Prompttemplateremoveconfirmtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove this prompt template?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove this prompt template?" |
 *
 * @param {Prompttemplateremoveconfirmtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateremoveconfirmtitle4 =
  /** @type {((inputs?: Prompttemplateremoveconfirmtitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateremoveconfirmtitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateremoveconfirmtitle4(inputs);
      return vi_prompttemplateremoveconfirmtitle4(inputs);
    }
  );
export { prompttemplateremoveconfirmtitle4 as "promptTemplateRemoveConfirmTitle" };
