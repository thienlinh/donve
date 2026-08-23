/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateremovesection3Inputs */

const vi_prompttemplateremovesection3 =
  /** @type {(inputs: Prompttemplateremovesection3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa phần`;
  };

const en_prompttemplateremovesection3 =
  /** @type {(inputs: Prompttemplateremovesection3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove section`;
  };

/**
 * | output |
 * | --- |
 * | "Remove section" |
 *
 * @param {Prompttemplateremovesection3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateremovesection3 =
  /** @type {((inputs?: Prompttemplateremovesection3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateremovesection3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateremovesection3(inputs);
      return vi_prompttemplateremovesection3(inputs);
    }
  );
export { prompttemplateremovesection3 as "promptTemplateRemoveSection" };
