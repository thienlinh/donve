/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatetestrunheading4Inputs */

const vi_prompttemplatetestrunheading4 =
  /** @type {(inputs: Prompttemplatetestrunheading4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chạy thử`;
  };

const en_prompttemplatetestrunheading4 =
  /** @type {(inputs: Prompttemplatetestrunheading4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Run a test`;
  };

/**
 * | output |
 * | --- |
 * | "Run a test" |
 *
 * @param {Prompttemplatetestrunheading4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatetestrunheading4 =
  /** @type {((inputs?: Prompttemplatetestrunheading4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatetestrunheading4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatetestrunheading4(inputs);
      return vi_prompttemplatetestrunheading4(inputs);
    }
  );
export { prompttemplatetestrunheading4 as "promptTemplateTestRunHeading" };
