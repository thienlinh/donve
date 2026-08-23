/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatecompareselect3Inputs */

const vi_prompttemplatecompareselect3 =
  /** @type {(inputs: Prompttemplatecompareselect3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `So sánh`;
  };

const en_prompttemplatecompareselect3 =
  /** @type {(inputs: Prompttemplatecompareselect3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Compare`;
  };

/**
 * | output |
 * | --- |
 * | "Compare" |
 *
 * @param {Prompttemplatecompareselect3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatecompareselect3 =
  /** @type {((inputs?: Prompttemplatecompareselect3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatecompareselect3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatecompareselect3(inputs);
      return vi_prompttemplatecompareselect3(inputs);
    }
  );
export { prompttemplatecompareselect3 as "promptTemplateCompareSelect" };
