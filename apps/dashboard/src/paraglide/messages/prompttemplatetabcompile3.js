/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatetabcompile3Inputs */

const vi_prompttemplatetabcompile3 =
  /** @type {(inputs: Prompttemplatetabcompile3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem trước biên dịch`;
  };

const en_prompttemplatetabcompile3 =
  /** @type {(inputs: Prompttemplatetabcompile3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Compile preview`;
  };

/**
 * | output |
 * | --- |
 * | "Compile preview" |
 *
 * @param {Prompttemplatetabcompile3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatetabcompile3 =
  /** @type {((inputs?: Prompttemplatetabcompile3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatetabcompile3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatetabcompile3(inputs);
      return vi_prompttemplatetabcompile3(inputs);
    }
  );
export { prompttemplatetabcompile3 as "promptTemplateTabCompile" };
