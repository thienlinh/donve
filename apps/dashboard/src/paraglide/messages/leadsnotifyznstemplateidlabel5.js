/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyznstemplateidlabel5Inputs */

const vi_leadsnotifyznstemplateidlabel5 =
  /** @type {(inputs: Leadsnotifyznstemplateidlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Template ID`;
  };

const en_leadsnotifyznstemplateidlabel5 =
  /** @type {(inputs: Leadsnotifyznstemplateidlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Template ID`;
  };

/**
 * | output |
 * | --- |
 * | "Template ID" |
 *
 * @param {Leadsnotifyznstemplateidlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyznstemplateidlabel5 =
  /** @type {((inputs?: Leadsnotifyznstemplateidlabel5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyznstemplateidlabel5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyznstemplateidlabel5(inputs);
      return vi_leadsnotifyznstemplateidlabel5(inputs);
    }
  );
export { leadsnotifyznstemplateidlabel5 as "leadsNotifyZnsTemplateIdLabel" };
