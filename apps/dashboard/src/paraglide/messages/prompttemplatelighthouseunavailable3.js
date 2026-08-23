/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatelighthouseunavailable3Inputs */

const vi_prompttemplatelighthouseunavailable3 =
  /** @type {(inputs: Prompttemplatelighthouseunavailable3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lighthouse không khả dụng trên môi trường này`;
  };

const en_prompttemplatelighthouseunavailable3 =
  /** @type {(inputs: Prompttemplatelighthouseunavailable3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lighthouse unavailable on this runtime`;
  };

/**
 * | output |
 * | --- |
 * | "Lighthouse unavailable on this runtime" |
 *
 * @param {Prompttemplatelighthouseunavailable3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatelighthouseunavailable3 =
  /** @type {((inputs?: Prompttemplatelighthouseunavailable3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatelighthouseunavailable3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_prompttemplatelighthouseunavailable3(inputs);
      return vi_prompttemplatelighthouseunavailable3(inputs);
    }
  );
export { prompttemplatelighthouseunavailable3 as "promptTemplateLighthouseUnavailable" };
