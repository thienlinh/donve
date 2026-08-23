/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyznstemplateidplaceholder5Inputs */

const vi_leadsnotifyznstemplateidplaceholder5 =
  /** @type {(inputs: Leadsnotifyznstemplateidplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `ID template ZNS đã được duyệt`;
  };

const en_leadsnotifyznstemplateidplaceholder5 =
  /** @type {(inputs: Leadsnotifyznstemplateidplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Approved ZNS template ID`;
  };

/**
 * | output |
 * | --- |
 * | "Approved ZNS template ID" |
 *
 * @param {Leadsnotifyznstemplateidplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyznstemplateidplaceholder5 =
  /** @type {((inputs?: Leadsnotifyznstemplateidplaceholder5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyznstemplateidplaceholder5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadsnotifyznstemplateidplaceholder5(inputs);
      return vi_leadsnotifyznstemplateidplaceholder5(inputs);
    }
  );
export { leadsnotifyznstemplateidplaceholder5 as "leadsNotifyZnsTemplateIdPlaceholder" };
