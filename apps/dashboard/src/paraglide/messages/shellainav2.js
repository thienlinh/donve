/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellainav2Inputs */

const vi_shellainav2 =
  /** @type {(inputs: Shellainav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI`;
  };

const en_shellainav2 =
  /** @type {(inputs: Shellainav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `AI`;
  };

/**
 * | output |
 * | --- |
 * | "AI" |
 *
 * @param {Shellainav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellainav2 =
  /** @type {((inputs?: Shellainav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellainav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellainav2(inputs);
      return vi_shellainav2(inputs);
    }
  );
export { shellainav2 as "shellAiNav" };
