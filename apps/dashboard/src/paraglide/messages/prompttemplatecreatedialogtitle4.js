/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecreatedialogtitle4Inputs */

const vi_prompttemplatecreatedialogtitle4 =
  /** @type {(inputs: Prompttemplatecreatedialogtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo mẫu prompt mới`;
  };

const en_prompttemplatecreatedialogtitle4 =
  /** @type {(inputs: Prompttemplatecreatedialogtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create a prompt template`;
  };

/**
 * | output |
 * | --- |
 * | "Create a prompt template" |
 *
 * @param {Prompttemplatecreatedialogtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecreatedialogtitle4 =
  /** @type {((inputs?: Prompttemplatecreatedialogtitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecreatedialogtitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecreatedialogtitle4(inputs);
      return vi_prompttemplatecreatedialogtitle4(inputs);
    }
  );
export { prompttemplatecreatedialogtitle4 as "promptTemplateCreateDialogTitle" };
