/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateremoveaction3Inputs */

const vi_prompttemplateremoveaction3 =
  /** @type {(inputs: Prompttemplateremoveaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa mẫu prompt`;
  };

const en_prompttemplateremoveaction3 =
  /** @type {(inputs: Prompttemplateremoveaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove template`;
  };

/**
 * | output |
 * | --- |
 * | "Remove template" |
 *
 * @param {Prompttemplateremoveaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateremoveaction3 =
  /** @type {((inputs?: Prompttemplateremoveaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateremoveaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateremoveaction3(inputs);
      return vi_prompttemplateremoveaction3(inputs);
    }
  );
export { prompttemplateremoveaction3 as "promptTemplateRemoveAction" };
