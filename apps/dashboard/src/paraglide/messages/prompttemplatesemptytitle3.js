/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesemptytitle3Inputs */

const vi_prompttemplatesemptytitle3 =
  /** @type {(inputs: Prompttemplatesemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có mẫu prompt nào`;
  };

const en_prompttemplatesemptytitle3 =
  /** @type {(inputs: Prompttemplatesemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No prompt templates yet`;
  };

/**
 * | output |
 * | --- |
 * | "No prompt templates yet" |
 *
 * @param {Prompttemplatesemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesemptytitle3 =
  /** @type {((inputs?: Prompttemplatesemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatesemptytitle3(inputs);
      return vi_prompttemplatesemptytitle3(inputs);
    }
  );
export { prompttemplatesemptytitle3 as "promptTemplatesEmptyTitle" };
