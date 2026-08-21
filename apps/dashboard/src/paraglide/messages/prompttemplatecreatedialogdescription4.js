/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecreatedialogdescription4Inputs */

const vi_prompttemplatecreatedialogdescription4 =
  /** @type {(inputs: Prompttemplatecreatedialogdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bắt đầu với một slug — các phần (sections) và biến (variables) được chỉnh sửa ở trang riêng của mẫu.`;
  };

const en_prompttemplatecreatedialogdescription4 =
  /** @type {(inputs: Prompttemplatecreatedialogdescription4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Start with a slug — sections and variables are edited from the template's own page.`;
  };

/**
 * | output |
 * | --- |
 * | "Start with a slug — sections and variables are edited from the template's own page." |
 *
 * @param {Prompttemplatecreatedialogdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecreatedialogdescription4 =
  /** @type {((inputs?: Prompttemplatecreatedialogdescription4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecreatedialogdescription4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_prompttemplatecreatedialogdescription4(inputs);
      return vi_prompttemplatecreatedialogdescription4(inputs);
    }
  );
export { prompttemplatecreatedialogdescription4 as "promptTemplateCreateDialogDescription" };
