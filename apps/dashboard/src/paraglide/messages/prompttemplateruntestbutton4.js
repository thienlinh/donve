/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateruntestbutton4Inputs */

const vi_prompttemplateruntestbutton4 =
  /** @type {(inputs: Prompttemplateruntestbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chạy thử`;
  };

const en_prompttemplateruntestbutton4 =
  /** @type {(inputs: Prompttemplateruntestbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Run test`;
  };

/**
 * | output |
 * | --- |
 * | "Run test" |
 *
 * @param {Prompttemplateruntestbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateruntestbutton4 =
  /** @type {((inputs?: Prompttemplateruntestbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateruntestbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateruntestbutton4(inputs);
      return vi_prompttemplateruntestbutton4(inputs);
    }
  );
export { prompttemplateruntestbutton4 as "promptTemplateRunTestButton" };
