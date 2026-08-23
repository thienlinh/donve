/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatetabtestbench4Inputs */

const vi_prompttemplatetabtestbench4 =
  /** @type {(inputs: Prompttemplatetabtestbench4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chạy thử`;
  };

const en_prompttemplatetabtestbench4 =
  /** @type {(inputs: Prompttemplatetabtestbench4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Test bench`;
  };

/**
 * | output |
 * | --- |
 * | "Test bench" |
 *
 * @param {Prompttemplatetabtestbench4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatetabtestbench4 =
  /** @type {((inputs?: Prompttemplatetabtestbench4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatetabtestbench4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatetabtestbench4(inputs);
      return vi_prompttemplatetabtestbench4(inputs);
    }
  );
export { prompttemplatetabtestbench4 as "promptTemplateTabTestBench" };
