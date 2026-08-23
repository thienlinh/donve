/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateremovevariable3Inputs */

const vi_prompttemplateremovevariable3 =
  /** @type {(inputs: Prompttemplateremovevariable3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa biến`;
  };

const en_prompttemplateremovevariable3 =
  /** @type {(inputs: Prompttemplateremovevariable3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove variable`;
  };

/**
 * | output |
 * | --- |
 * | "Remove variable" |
 *
 * @param {Prompttemplateremovevariable3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateremovevariable3 =
  /** @type {((inputs?: Prompttemplateremovevariable3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateremovevariable3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateremovevariable3(inputs);
      return vi_prompttemplateremovevariable3(inputs);
    }
  );
export { prompttemplateremovevariable3 as "promptTemplateRemoveVariable" };
