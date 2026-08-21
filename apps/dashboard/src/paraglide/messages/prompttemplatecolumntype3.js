/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecolumntype3Inputs */

const vi_prompttemplatecolumntype3 =
  /** @type {(inputs: Prompttemplatecolumntype3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Loại`;
  };

const en_prompttemplatecolumntype3 =
  /** @type {(inputs: Prompttemplatecolumntype3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Type`;
  };

/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Prompttemplatecolumntype3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecolumntype3 =
  /** @type {((inputs?: Prompttemplatecolumntype3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecolumntype3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecolumntype3(inputs);
      return vi_prompttemplatecolumntype3(inputs);
    }
  );
export { prompttemplatecolumntype3 as "promptTemplateColumnType" };
