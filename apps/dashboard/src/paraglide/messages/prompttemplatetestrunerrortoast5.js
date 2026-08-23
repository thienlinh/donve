/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatetestrunerrortoast5Inputs */

const vi_prompttemplatetestrunerrortoast5 =
  /** @type {(inputs: Prompttemplatetestrunerrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chạy thử thất bại. Vui lòng thử lại.`;
  };

const en_prompttemplatetestrunerrortoast5 =
  /** @type {(inputs: Prompttemplatetestrunerrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Test run failed. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Test run failed. Try again." |
 *
 * @param {Prompttemplatetestrunerrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatetestrunerrortoast5 =
  /** @type {((inputs?: Prompttemplatetestrunerrortoast5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatetestrunerrortoast5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatetestrunerrortoast5(inputs);
      return vi_prompttemplatetestrunerrortoast5(inputs);
    }
  );
export { prompttemplatetestrunerrortoast5 as "promptTemplateTestRunErrorToast" };
